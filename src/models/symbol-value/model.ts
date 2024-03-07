import { DTO } from "./dto";
import mongoose from "../../db/mongo";

export default interface Model{
    add(symbolValue: DTO): Promise<DTO>;
    getLatest(symbol:string): Promise<DTO>;
}