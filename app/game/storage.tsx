export enum GAMEMODE_DIFFICULTY {
    DTWS_EASY = 'DTWS-easy',
    DTWS_MEDIUM = 'DTWS-medium',
    DTWS_HARD = 'DTWS-hard',
    DITD_EASY = 'DITD-easy',
    DITD_MEDIUM = 'DITD-medium',
    DITD_HARD = 'DITD-hard',
    DBTW_EASY = 'DBTW-easy',
    DBTW_MEDIUM = 'DBTW-medium',
    DBTW_HARD = 'DBTW-hard'
}

export function resetStorage() {
    if (typeof window !== 'undefined') {
        console.log('Initializing storage');
        localStorage.setItem('DTWS-easy', '0');
        localStorage.setItem('DTWS-medium', '0');
        localStorage.setItem('DTWS-hard', '0');
        localStorage.setItem('DITD-easy', '0');
        localStorage.setItem('DITD-medium', '0');
        localStorage.setItem('DITD-hard', '0');
        localStorage.setItem('DBTW-easy', '0');
        localStorage.setItem('DBTW-medium', '0');
        localStorage.setItem('DBTW-hard', '0');
        localStorage.setItem('currentCharacter', '1');
        localStorage.setItem('currentGrade', 'F');
    }
}

export function checkPlayed(mode: GAMEMODE_DIFFICULTY): boolean {
    return localStorage.getItem(mode) === '1';
}

export function setPlayed(mode: string, difficulty: string) {
    localStorage.setItem(mode + '-' + difficulty, '1');
}

export function canPlayMedium(): boolean {
    return compareGrade('C') > 0;
}

export function canPlayHard(): boolean {
    return compareGrade('B') > 0;
}

export function canPlayFinal(): boolean {
    return compareGrade('A') > 0;
}

export var currentCharacter = typeof window !== 'undefined' ? parseInt(localStorage.getItem('currentCharacter') || '1') : 1;

export function setCurrentCharacter(c: number) {
    currentCharacter = c;
    if (typeof window !== 'undefined') {
        localStorage.setItem('currentCharacter', c.toString());
    }
}

export function getCurrentCharacter() {
    return currentCharacter;
}

export var currentGrade = typeof window !== 'undefined' ? localStorage.getItem('currentGrade') || 'F' : 'F';

export function promoteGrade() {
    switch (currentGrade) {
        case 'F':
            currentGrade = 'D';
            break;
        case 'D':
            currentGrade = 'C';
            break;
        case 'C':
            currentGrade = 'C+';
            break;
        case 'C+':
            currentGrade = 'B-';
            break;
        case 'B-':
            currentGrade = 'B';
            break;
        case 'B':
            currentGrade = 'B+';
            break;
        case 'B+':
            currentGrade = 'A-';
            break;
        case 'A-':
            currentGrade = 'A';
            break;
        case 'A':
            currentGrade = 'A+';
            break;
    }
    if (typeof window !== 'undefined') {
        localStorage.setItem('currentGrade', currentGrade);
    }
}

export function getCurrentGrade() {
    return currentGrade;
}

export function compareGrade(grade: string): number {
    var grades = ['F', 'D', 'C', 'C+', 'B-', 'B', 'B+', 'A-', 'A', 'A+'];
    return grades.indexOf(getCurrentGrade()) - grades.indexOf(grade);
}