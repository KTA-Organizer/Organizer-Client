export const createSchoolyear = () => {
    const date =
        moment().month() + 1 >= 9 // September indicates new schoolyear
        ?
        `${moment().format("YYYY")} - ${moment().add(1, "y").format("YYYY")}` :
        `${moment().subtract(1).format("YYYY")} - ${moment().format("YYYY")}`;
    return date;
};

export const getKeyByValue = (object, value) => {
    return Object.keys(object).find(key => object[key] === value);
};