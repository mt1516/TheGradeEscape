export enum GAMEMODE_DIFFICULTY {
    DTWS_EASY = 'DTWS-easy',
    DTWS_MEDIUM = 'DTWS-medium',
    DTWS_HARD = 'DTWS-hard',
    DITD_EASY = 'DITD-easy',
    DITD_MEDIUM = 'DITD-medium',
    DITD_HARD = 'DITD-hard',
    DBTW_EASY = 'DBTW-easy',
    DBTW_MEDIUM = 'DBTW-medium',
    DBTW_HARD = 'DBTW-hard',
    FINAL_HARD = 'final-hard'
}

export function getCurrentGrade() {
    return typeof window !== 'undefined' ? localStorage.getItem('currentGrade') || 'X' : 'X';
}

export function getCurrentCharacter() {
    return currentCharacter;
}

export function getCurrentScore(): number {
    return parseInt(localStorage.getItem('DTWS-easy') || '0') +
        parseInt(localStorage.getItem('DTWS-medium') || '0') +
        parseInt(localStorage.getItem('DTWS-hard') || '0') +
        parseInt(localStorage.getItem('DITD-easy') || '0') +
        parseInt(localStorage.getItem('DITD-medium') || '0') +
        parseInt(localStorage.getItem('DITD-hard') || '0') +
        parseInt(localStorage.getItem('DBTW-easy') || '0') +
        parseInt(localStorage.getItem('DBTW-medium') || '0') +
        parseInt(localStorage.getItem('DBTW-hard') || '0') +
        parseInt(localStorage.getItem('final-hard') || '0');
}

export function initStorage() {
    resetCurrentGame(false);
    resetScoreBoard(false);
    if (typeof window !== 'undefined') {
        localStorage.setItem('currentCharacter', '1');
    }
}

export function resetCurrentGame(reload: boolean = true) {
    if (typeof window !== 'undefined') {
        localStorage.setItem('DTWS-easy', '0');
        localStorage.setItem('DTWS-medium', '0');
        localStorage.setItem('DTWS-hard', '0');
        localStorage.setItem('DITD-easy', '0');
        localStorage.setItem('DITD-medium', '0');
        localStorage.setItem('DITD-hard', '0');
        localStorage.setItem('DBTW-easy', '0');
        localStorage.setItem('DBTW-medium', '0');
        localStorage.setItem('DBTW-hard', '0');
        localStorage.setItem('final-hard', '0');
        localStorage.setItem('currentGrade', 'F');
        if (reload) {
            window.location.reload();
        }
    }
}

export function resetScoreBoard(reload: boolean = true) {
    if (typeof window !== 'undefined') {
        localStorage.setItem('top-1-s', '0');
        localStorage.setItem('top-2-s', '0');
        localStorage.setItem('top-3-s', '0');
        localStorage.setItem('top-4-s', '0');
        localStorage.setItem('top-5-s', '0');
        localStorage.setItem('top-6-s', '0');
        localStorage.setItem('top-7-s', '0');
        localStorage.setItem('top-8-s', '0');
        localStorage.setItem('top-9-s', '0');
        localStorage.setItem('top-10-s', '0');
        localStorage.setItem('top-1-g', 'F');
        localStorage.setItem('top-2-g', 'F');
        localStorage.setItem('top-3-g', 'F');
        localStorage.setItem('top-4-g', 'F');
        localStorage.setItem('top-5-g', 'F');
        localStorage.setItem('top-6-g', 'F');
        localStorage.setItem('top-7-g', 'F');
        localStorage.setItem('top-8-g', 'F');
        localStorage.setItem('top-9-g', 'F');
        localStorage.setItem('top-10-g', 'F');
        if (reload) {
            window.location.reload();
        }
    }
}

export function updateScoreBoard(score: number) {
    if (typeof window === 'undefined') return;
    const grade = getCurrentGrade();
    var scores = [];
    for (var i = 1; i <= 10; i++) {
        scores.push(parseInt(localStorage.getItem('top-' + i) || '0'));
    }
    var grades = [];
    for (var i = 1; i <= 10; i++) {
        grades.push(localStorage.getItem('top-' + i + '-g') || 'F');
    }
    scores.push(score);
    grades.push(grade);
    scores.sort((a, b) => b - a);
    grades.sort((a, b) => compareGrade(b) - compareGrade(a));
    for (var i = 1; i <= 10; i++) {
        localStorage.setItem('top-' + i, scores[i - 1].toString());
        localStorage.setItem('top-' + i + '-g', grades[i - 1]);
    }
}

export function getScoreBoard(): { score: number, grade: string }[] {
    if (typeof window === 'undefined') return [];
    var scores = [];
    for (var i = 1; i <= 10; i++) {
        scores.push({
            score: parseInt(localStorage.getItem('top-' + i) || '0'),
            grade: localStorage.getItem('top-' + i + '-g') || 'F'
        });
    }
    return scores;
}

export function checkPlayed(mode: GAMEMODE_DIFFICULTY): boolean {
    return localStorage.getItem(mode) != null && localStorage.getItem(mode)! > '0';
}

export function setPlayed(mode: string, difficulty: string, score: number) {
    localStorage.setItem(mode + '-' + difficulty, score.toString());
}

export function canPlayFinal(): boolean {
    return checkPlayed(GAMEMODE_DIFFICULTY.DBTW_HARD) && checkPlayed(GAMEMODE_DIFFICULTY.DITD_HARD) && checkPlayed(GAMEMODE_DIFFICULTY.DTWS_HARD);
}

export var currentCharacter = typeof window !== 'undefined' ? parseInt(localStorage.getItem('currentCharacter') || '-1') : -1;

export function setCurrentCharacter(c: number) {
    currentCharacter = c;
    if (typeof window !== 'undefined') {
        localStorage.setItem('currentCharacter', c.toString());
    }
}

export function promoteGrade() {
    var currentGrade = getCurrentGrade();
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

export function demoteGrade() {
    var currentGrade = getCurrentGrade();
    switch (currentGrade) {
        case 'A+':
            currentGrade = 'A';
            break;
        case 'A':
            currentGrade = 'A-';
            break;
        case 'A-':
            currentGrade = 'B+';
            break;
        case 'B+':
            currentGrade = 'B';
            break;
        case 'B':
            currentGrade = 'B-';
            break;
        case 'B-':
            currentGrade = 'C+';
            break;
        case 'C+':
            currentGrade = 'C';
            break;
        case 'C':
            currentGrade = 'D';
            break;
        case 'D':
            currentGrade = 'F';
            break;
    }
    if (typeof window !== 'undefined') {
        localStorage.setItem('currentGrade', currentGrade);
    }
}

export function compareGrade(grade: string): number {
    var grades = ['F', 'D', 'C', 'C+', 'B-', 'B', 'B+', 'A-', 'A', 'A+'];
    return grades.indexOf(getCurrentGrade()) - grades.indexOf(grade);
}