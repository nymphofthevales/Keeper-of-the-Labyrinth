visited = new Array();

scoredPages = [
    {
        pageObject: MoveOnAnte,
        type: 'apathy',
        change: [2,'+'],
    },
    {
        pageObject: LeaveAnte,
        type: 'apathy',
        change: [1,'-']
    },
    {
        pageObject: Fleeing,
        type: 'apathy',
        change: [1,'+']
    },
    {
        pageObject: investigateFleeing,
        type: 'apathy',
        change: [1,'-']
    },
    {
        pageObject: LeaveWall,
        type: 'apathy',
        change: [1,'+']
    },
    {
        pageObject: MoveOnGarden,
        type: 'apathy',
        change: [3,'+']
    },
    {
        pageObject: Fleeing,
        type: 'cowardice',
        change: [1,'+']
    },
    {
        pageObject: turnFleeing,
        type: 'cowardice',
        change: [1,'-']
    },
    {
        pageObject: Pressing,
        type: 'cowardice',
        change: [3,'+']
    },
    {
        pageObject: Falling,
        type: 'cowardice',
        change: [1,'+']
    },
    {
        pageObject: scorn,
        type: 'cowardice',
        change: [2,'+']
    },
    {
        pageObject: LeaveWall,
        type: 'doubt',
        change: [1,'+']
    },
    {
        pageObject: lost,
        type: 'doubt',
        change: [3,'+']
    },
]

specialPages = [
    {
        pageObject: inventory, 
        action: function() {
            obelisk.removeOption('Assay your tools',inventory);
            obelisk.addOption('Toss the runes',castRunes);
            finishCandleAnte.addOption('Toss the runes',castRunes);
            if (visited.includes('obelisk') === true) {
                inventory.addOption('Light a candle',CandleAnte);
                readRunes.addOption('Light a candle',CandleAnte);
            }
            if (visited.includes('obelisk') === true && visited.includes('inventory') === true && visited.includes('finishCandleAnte') === true && visited.includes('readRunes') === true) {
                actionFinishedAnte();
            }
        }
    },
    {
        pageObject: obelisk, 
        action: function() {
            manageImage('print','top','./assets/obelisk.png');
            inventory.removeOption('Examine the obelisk',obelisk);
            if (visited.includes('inventory') === true) {
                obelisk.addOption('Light a candle',CandleAnte);
                readRunes.addOption('Light a candle',CandleAnte);
            }
            if (visited.includes('obelisk') === true && visited.includes('inventory') === true && visited.includes('finishCandleAnte') === true && visited.includes('readRunes') === true) {
                actionFinishedAnte();
            }
        }
    },
    {
        pageObject: castRunes, 
        action: function() {
            manageImage('print','top','./assets/runes.png')
        }
    },
    {
        pageObject: readRunes, 
        action: function() {
            manageImage('print','top','./assets/runes.png')
            if (visited.includes('obelisk') === true && visited.includes('inventory') === true && visited.includes('finishCandleAnte') === true && visited.includes('readRunes') === true) {
                actionFinishedAnte();
            }
        }
    },
    {
        pageObject: CandleAnte, 
        action: function() {
            manageImage('print','top','./assets/candles.png')
            if (visited.includes('obelisk') === true && visited.includes('inventory') === true && visited.includes('finishCandleAnte') === true && visited.includes('readRunes') === true) {
                actionFinishedAnte();
            }
        }
    },
    {
        pageObject: finishCandleAnte, 
        action: function() {
            manageImage('print','top','./assets/candles.png')
        }
    },
    {
        pageObject: Lines, 
        action: function() {
            manageImage('print','top','./assets/chalk.png');
        }
    },
    {
        pageObject: Wands, 
        action: function() {
            manageImage('print','top','./assets/wand.png');
        }
    },
    {
        pageObject: runFleeing, 
        action: function() {
            if (visited.includes('turnFleeing')) {
                runFleeing.addOption('Check again',checkFleeing);
            } else {
                runFleeing.addOption('Turn',turnFleeing);
            };
        }
    },
    {
        pageObject: turnFleeing, 
        action: function() {
            if (visited.includes('runFleeing')) {
                turnFleeing.addOption('Continue',chamberFleeing);
            } else {
                turnFleeing.addOption('Run',runFleeing);
            }
        }
    },
    {
        pageObject: chamberFleeing, 
        action: function() {
            let lostShadow = true;
            //change outcome in ignoring and dark
        }
    },
    {
        pageObject: WatchingBlink, 
        action: function(current) {
            redirect(2000,current)
            redirect(2500,current)
        }
    },
    {
        pageObject: Cut, 
        action: function() {
            let failures = Blades.checkScores();
            if (failures.includes('apathyScore')) {
                Cut.removeOption('Apathy')
                Cut.removeOption('Cowardice')
                Cut.removeOption('Doubt')
                Cut.addOption('Apathy',failApathy);
                Cut.addOption('Cowardice',Cowardice);
                Cut.addOption('Doubt',Doubt);

                Cowardice.removeOption('Doubt');
                Cowardice.removeOption('Apathy');
                Doubt.removeOption('Cowardice');
                Doubt.removeOption('Apathy');
                Cowardice.addOption('Apathy',failApathy);
                Cowardice.addOption('Doubt',Doubt);
                Doubt.addOption('Apathy',failApathy);
                Doubt.addOption('Cowardice',Cowardice);
            } 
            if (failures.includes('cowardiceScore')) {
                Cut.removeOption('Cowardice');
                Cut.removeOption('Doubt');
                Cut.addOption('Cowardice',failCowardice);
                Cut.addOption('Doubt',Doubt);

                Apathy.removeOption('Doubt');
                Apathy.removeOption('Cowardice');
                Doubt.removeOption('Cowardice');
                Apathy.addOption('Cowardice',failCowardice);
                Apathy.addOption('Doubt',Doubt);
                Doubt.addOption('Cowardice',failCowardice);
            } 
            if (failures.includes('doubtScore')) {
                Cut.removeOption('Doubt');
                Cut.addOption('Doubt',failDoubt);

                Apathy.removeOption('Doubt');
                Cowardice.removeOption('Doubt');
                Apathy.addOption('Doubt',failDoubt);
                Cowardice.addOption('Doubt',failDoubt);
            };
        }
    },
    {
        pageObject: Apathy, 
        action: function() {
            if (visited.includes('Cowardice') && visited.includes('Doubt')) {
                Apathy.clearOptions();
                Apathy.addOption('Rise for air',freeCistern)
            }
            Cut.removeOption('Apathy',Apathy);
            Cowardice.removeOption('Apathy',Apathy);
            Doubt.removeOption('Apathy',Apathy);
        }
    },
    {
        pageObject: Cowardice, 
        action: function() {
            if (visited.includes('Apathy') && visited.includes('Doubt')) {
                Cowardice.clearOptions();
                Cowardice.addOption('Rise for air',freeCistern)
            }
            Cut.removeOption('Cowardice',Cowardice);
            Apathy.removeOption('Cowardice',Cowardice);
            Doubt.removeOption('Cowardice',Cowardice);
        }
    },
    {
        pageObject: Doubt, 
        action: function() {
            if (visited.includes('Cowardice') && visited.includes('Apathy')) {
                Doubt.clearOptions();
                Doubt.addOption('Rise for air',freeCistern)
            }
            Cut.removeOption('Doubt',Doubt);
            Cowardice.removeOption('Doubt',Doubt);
            Apathy.removeOption('Doubt',Doubt);
        }
    },
    {
        pageObject: failApathy, 
        action: function() {
            let failApathyVariableText = ''
            if (visited.includes('MoveOnAnte')) {
                failApathyVariableText + 'my foolish rush through the antechamber—that unreasoned lack of preparations, '
            }
            if ((visited.includes('Fleeing') === true) && (visited.includes('investigateFleeing') === false)) {
                failApathyVariableText + 'my lazy disinterest in investigating the hole of shadow, '
            }
            if (visited.includes('LeaveWall')) {
                failApathyVariableText + 'my ignorance of fixing the gap in the wall, '
            }
            if (visited.includes('MoveOnGarden')) {
                failApathyVariableText + 'my lack of care for the rowan, '
            }
            failApathy.addPage(`I've already given into her. Since the start, since ${failApathyVariableText}my apathy has dulled my senses. How could I fight her now, when she's already won?`,'give up');
        }
    },
    {
        pageObject: failCowardice, 
        action: function() {
            let failCowardiceVariableText = ''
            if ((visited.includes('Fleeing') === true) && (visited.includes(turnFleeing) === false)) {
                failCowardiceVariableText + 'my lack of ability to even <em>look</em> at whatever had been chasing me, '
            }
            if (visited.includes('Pressing')) {
                failCowardiceVariableText + 'my foolish attempt to escape my duties by pressing through the gap in the wall, '
            }
            if (visited.includes('Falling')) {
                failCowardiceVariableText + 'my fear of facing what I might see in the darkness, '
            }
            if (visited.includes('scorn')) {
                failCowardiceVariableText + 'my unwillingness to let myself dance freely and joyously to the music in the pit, '
            }
            failCowardice.addPage(`It's futile to fight her now; I know her too well. Since ${failCowardiceVariableText}I've given in to cowardice before and I'm sure I will again.`,'give up');
        }
    },
    {
        pageObject: failDoubt, 
        action: function() {
            let failDoubtVariableText = ''
            if (visited.includes('LeaveWall')) {
                failDoubtVariableText + 'not when I doubted whether it was right to fix the gap in the wall, '
            }
            if (visited.includes('lost')) {
                failDoubtVariableText + 'not when I lost myself in the darkness, '
            }
            if (visited.includes('')) {
                failDoubtVariableText + ', '
            }
            failDoubt.addPage(`I try to scream: "Shut up! You're wrong!" But the water drowns my cries and all that escapes is empty bubbles. She's too strong. I've never been able to fight her before, ${failDoubtVariableText}so how could I defeat her now?`,'give up');
        }
    },
    {
        pageObject: Waiting, 
        action: function() {
            Cave.removeOption('Follow the dirge',Waiting);
        }
    },
    {
        pageObject: 'object', 
        action: function() {

        }
    },
]

function actionFinishedAnte() {
    let anteNodes = [inventory,obelisk,finishCandleAnte,readRunes]
    for (let i = 0; i<anteNodes.length; i++) {
        anteNodes[i].clearOptions();
        anteNodes[i].addOption('Leave',LeaveAnte);
    }
}
function checkSpecialActions(current) {
    for (let i = 0; i < specialPages.length; i++) {
        if (current === specialPages[i].pageObject) {
            specialPages[i].action(current);
            return true
        }
    }
}
Blades.generateScores = function() {
    apathyScore = 0;
    cowardiceScore = 0;
    doubtScore = 0;
    for (let i=0; i<scoredPages.length; i++) {
        if (visited.includes(scoredPages[i].pageObject.title)) {
            //if any scoredPages are in the visited array, follow the instructions there to add or subtract the amount specified to to the score specified.
            if (scoredPages[i].change[1] === '+') {
                if (scoredPages[i].type === 'apathy') {
                    apathyScore += scoredPages[i].change[0];
                } else if (scoredPages[i].type === 'cowardice') {
                    cowardiceScore += scoredPages[i].change[0];
                } else if (scoredPages[i].type === 'doubt') {
                    doubtScore += scoredPages[i].change[0];
                }
            } else if (scoredPages[i].change[1] === '-') {
                if (scoredPages[i].type === 'apathy') {
                    apathyScore -= scoredPages[i].change[0];
                } else if (scoredPages[i].type === 'cowardice') {
                    cowardiceScore -= scoredPages[i].change[0];
                } else if (scoredPages[i].type === 'doubt') {
                    doubtScore -= scoredPages[i].change[0];
                }
            }
        }
    }
    return [apathyScore,cowardiceScore,doubtScore]
}
Blades.checkFailures = function() {
    let totalApathy = 0;
    let totalCowardice = 0;
    let totalDoubt = 0;
    for (let i=0; i<scoredPages.length; i++) {
        //for every page that affects a score positively in the scoredPages array, add its value to the possible total used to generate the threshold value for failure.
        if (scoredPages[i].change[1] === '+') {
            if (scoredPages[i].type === 'apathy') {
                totalApathy += scoredPages[i].change[0];
            } else if (scoredPages[i].type === 'cowardice') {
                totalCowardice += scoredPages[i].change[0];
            } else if (scoredPages[i].type === 'doubt') {
                totalDoubt += scoredPages[i].change[0];
            }
        }
    }
    let generateThreshold = (number) => Math.ceil(2.5*(number/5));
    let apathyThreshold = generateThreshold(totalApathy);
    let cowardiceThreshold = generateThreshold(totalCowardice);
    let doubtThreshold = generateThreshold(totalDoubt);
    let failures = [];
    if (apathyScore >= apathyThreshold) {
        failures.push('apathyScore');
    }
    if (cowardiceScore >= cowardiceThreshold) {
        failures.push('cowardiceScore');
    }
    if (doubtScore >= doubtThreshold) {
        failures.push('doubtScore')
    }
    return [failures,apathyScore,totalApathy,apathyThreshold,cowardiceScore,totalCowardice,cowardiceThreshold,doubtScore,totalDoubt,doubtThreshold];
}