import { OkPacketParams } from "mysql2";
import query from "../../db/mysql"
import { DTO } from "./dto"
import { Model } from "./model"

class MySQL implements Model{
    async add(userSymbol: DTO): Promise<DTO> {
        const { userId, symbol} = userSymbol;
        const result: OkPacketParams = await query(`
            INSERT INTO users_symbols
            (user_id, symbol)
            VALUES
            (?,?)
        `,[userId, symbol]);
        
        const newUserSymbol: DTO = {
            ...userSymbol,
            id: result.insertId
        }
        return newUserSymbol
    }
    async getForUser(userId: number): Promise<DTO[]> {
        const userSymbols: DTO[] = await query(`
        SELECT  id, user_id, symbol
        FROM    users_symbols
        WHERE   user_id = ?
        `,[userId]);
        return userSymbols   
    }
    async getUniqueSymbols(): Promise<string[]>{
        const symbols: {symbol: string}[] = await query(`
            SELECT DISTINCT symbol FROM users_symbols
        `);
        const mapped = symbols.map(symbol => symbol.symbol) 
        return mapped;
    };
}

const mysql = new MySQL();
export default mysql;