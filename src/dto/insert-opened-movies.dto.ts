export type OpenMoviesPayload = {
    movie_id: string,
    available_seats: number,
    max_seats: number,
    room_code: string,
    start_time: string,
    finish_time: string,
    ticket_price: number,
    status: 'open' | 'closed'
}

export const generateRandomStringCode = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';

    const letter = letters[Math.floor(Math.random() * letters.length)]
    const randNumbers = Array(3).fill(0).map(() => numbers[Math.floor(Math.random() * numbers.length)])

    return letter + randNumbers.join('')
}

export const getFormattedDate = () => {
    const date = new Date()
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    }

    const newDate = new Intl.DateTimeFormat('en-US', options).format(date)
    const parts = newDate.split(' ');
    parts.splice(3, 1);

    return parts.join(' ')
}

export const getFinishTime = (targetTime: string) => {
    const currentDate = new Date()
    const targethours = parseInt(targetTime.split(':')[0])
    const targetminute = parseInt(targetTime.split(':')[1])
    const targetseconds = parseInt(targetTime.split(':')[2])

    const targetDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() - (Math.random() * 31) + 1,
        targethours,
        targetminute,
        targetseconds
    );

    if(targetDate < currentDate){
        targetDate.setDate(targetDate.getDate() + 1)
    }

    const timeDifference = targetDate.getTime() - currentDate.getTime()
    const formattedTargetDate = new Date(currentDate.getTime() - timeDifference)
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    };
    const newDate = new Intl.DateTimeFormat('en-US', options).format(formattedTargetDate)
    const parts = newDate.split(' ');
    parts.splice(3, 1);

    return parts.join(' ')
}

export const getRandPrice = (min: number = 20000, max: number = 200000) => {
    return Math.floor(Math.random() * (max - min + 1)) + min
}