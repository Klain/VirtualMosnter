export const evolutionRules = [
{from:'baby',to:'child_a',minAgeHours:1,maxCareMistakes:2},{from:'baby',to:'child_b',minAgeHours:1},
{from:'child_a',to:'adult_c',minAgeHours:6,minTraining:3,maxCareMistakes:3},{from:'child_a',to:'adult_d',minAgeHours:6},
{from:'child_b',to:'adult_d',minAgeHours:6,minTraining:2},{from:'adult_c',to:'perfect_j',minAgeHours:18,minVictories:3,minTraining:6},
{from:'adult_d',to:'perfect_j',minAgeHours:18,minVictories:4}
];