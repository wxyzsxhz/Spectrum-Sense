export const ageInMonths = (birthday) => {
    console.log(birthday);
    
    const today = new Date();
    let months = (today.getFullYear() - birthday.getFullYear()) * 12;
    months += today.getMonth() - birthday.getMonth();
    if (today.getDate() < birthday.getDate()) {
        months--;
    }
    return months;
}