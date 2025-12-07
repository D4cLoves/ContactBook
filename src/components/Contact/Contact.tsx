export default class Contact {
    id : number;

    name : string;
    surname : string;
    patronymic : string;

    type : string;

    phones : string[];

    constructor(id : number, name : string, surname : string, patronymic : string, type : string, phones : string[]) {
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.patronymic = patronymic;
        this.type = type;
        this.phones = phones;
    }


    update(name: string, surname: string, patronymic: string, type: string, phones: string[]) {
        this.name = name;
        this.surname = surname;
        this.patronymic = patronymic;
        this.type = type;
        this.phones = phones;
    }
}
