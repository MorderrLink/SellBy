
type cardType = {
    number: string;
    date: string;
    cvc: string;
    holderName: string;
    address: string;
}

export const validateCard = ({number, date, cvc, holderName, address}: cardType) => {

    if (number.length != 16) {
        return "Card number should be a 16-digit number value!"
    }
    if (/^\d+$/.test(number) != true) {
        return "Card number should be a 16-digit number value!"
    } 
    const month = Number(date.slice(0, 2)) 
    const year = date.slice(2, 4)
    if (/^\d+$/.test(number) != true) {
        return "Enter valid date!"
    }
    if (month > 12) {
        return "Field month incorrect!"
    }
    if (/^\d+$/.test(cvc) != true) {
        return "CVC should be a 3-digit number value!"
    }
    if (holderName.length == 0) {
        return "Enter card holder's name"
    }
    if (address.length == 0) {
        return "Enter billing address"
    }

    return "Valid"

}
