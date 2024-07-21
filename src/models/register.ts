class Register {
    name: string;
    bitLength: number;
    value: number;
    
    constructor(name: string, bitLength: number, value: number = 0b0) {
        this.name = name;
        this.bitLength = bitLength;
        this.value = value;
    }
}

export default Register;