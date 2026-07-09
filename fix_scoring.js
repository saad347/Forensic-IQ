import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

const oldFuncStart = '  const handleSubmitDiagnosis = (suspectedCauseId: string, justification: string, citedEvidenceIds: string[]) => {';
const oldFuncEnd = '  };';

let startIndex = content.indexOf(oldFuncStart);
let endIndex = content.indexOf(oldFuncEnd, startIndex) + oldFuncEnd.length;

const newFunc = `  const handleSubmitDiagnosis = (suspectedCauseId: string, justification: string, citedEvidenceIds: string[]) => {
    if (!activeCase) return;
    setSubmittingDiagnosis(true);
    setErrorMessage(null);

    const isCorrect = suspectedCauseId === activeCase.correctCauseId;
    const correctCause = activeCase.taxonomyCauses.find(c => c.id === activeCase.correctCauseId);
    const userCause = activeCase.taxonomyCauses.find(c => c.id === suspectedCauseId);

    const correctPoints = isCorrect ? 50 : 0;
    const unlockedRedHerringsCount = evidence.filter(e => e.unlocked && e.redHerring).length;
    const redHerringPenalty = unlockedRedHerringsCount * 10;
    const budgetBonus = Math.round(budget * 0.5);
    const baseInvestigativeScore = Math.max(0, correctPoints + budgetBonus - redHerringPenalty);

    let justificationScore = 0;
    let correctCitations = 0;
    let correctCitationPoints = 0;
    let redHerringPenaltyPoints = 0;
    let citedRedHerrings: string[] = [];
    let citedValidEvidence: string[] = [];

    citedEvidenceIds.forEach(id => {
      const card = evidence.find(e => e.id === id);
      if (card) {
        if (card.supportsCauseIds.includes(activeCase.correctCauseId)) {
          correctCitations++;
          if (correctCitations === 1) correctCitationPoints += 40;
          else correctCitationPoints += 10;
          citedValidEvidence.push(card.name);
        }
        if (card.redHerring) {
          redHerringPenaltyPoints += 15;
          citedRedHerrings.push(card.name);
        }
      }
    });

    correctCitationPoints = Math.min(70, correctCitationPoints);
    justificationScore = correctCitationPoints - redHerringPenaltyPoints;
    justificationScore = Math.max(0, Math.min(100, justificationScore));

    if (citedEvidenceIds.length === 0) {
      justificationScore = 0;
    }

    const finalScore = Math.round((baseInvestigativeScore * 0.6) + (justificationScore * 0.4));

    const getClientFeedback = () => {
      const uCauseName = userCause?.name || 'Unknown Mechanism';
      const cCauseName = correctCause?.name || 'Unknown Mechanism';

      let text = isCorrect 
        ? \`Excellent physical diagnosis! Your identification of \${cCauseName} perfectly aligns with the forensic metallurgical observations. \` 
        : \`Peer Review Status: Rejected. You proposed \${uCauseName}, but structural archives do not substantiate this. \`;

      if (citedEvidenceIds.length === 0) {
        text += "No evidence was cited to support this diagnosis. ";
      } else {
        if (citedValidEvidence.length > 0) {
          text += \`Your citation of \${citedValidEvidence.join(', ')} correctly supports the physics of this failure. \`;
        } else if (isCorrect) {
          text += \`However, your cited evidence does not strongly support this conclusion. \`;
        }
        
        if (citedRedHerrings.length > 0) {
          text += \`Note: Your citation of \${citedRedHerrings.join(', ')} weakens your report; this evidence was a red herring intended to test your diagnostic focus. \`;
        }
      }
      return text;
    };

    setTimeout(() => {
      const newSession = {
        caseId: activeCase.id,
        completedAt: new Date().toISOString(),
        score: finalScore,
        suspectedCauseId,
        justification,
        hypotheses,
        unlockedEvidenceIds: evidence.filter(e => e.unlocked).map(e => e.id),
        pointsSpent,
        correct: isCorrect,
        gradingFeedback: getClientFeedback(),
        gradingScore: justificationScore
      };

      const updatedHistory = [...user.history.filter(h => h.caseId !== activeCase.id), newSession];
      const newTotalScore = updatedHistory.reduce((acc, h) => acc + h.score, 0);

      setUser(prev => ({
        ...prev,
        history: updatedHistory,
        totalScore: newTotalScore
      }));

      setCompletedSession(newSession);
      setSubmittingDiagnosis(false);
    }, 1100);
  };`;

content = content.substring(0, startIndex) + newFunc + content.substring(endIndex);
fs.writeFileSync('src/App.tsx', content);
