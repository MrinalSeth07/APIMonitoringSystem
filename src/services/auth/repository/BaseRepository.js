// Interface

export default class BaseRepository{
    constructor(model){
        this.model = model;
    }

    async create(data){
        throw new Error("Method not implemented");
    }
    async findbyId(id){
        throw new Error("Method not implemented");
    }
    async findbyUsername(username){
        throw new Error("Method not implemented");
    }
    async findbyEmail(email){
        throw new Error("Method not implemented");
    }
    async findAll(){
        throw new Error("Method not implemented");
    }
}