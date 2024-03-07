import { OkPacketParams } from "mysql2";
import query from "../../db/mysql";
import { DTO } from "./dto";
import { Model } from "./model";

class MySQL implements Model {

    async signup(user: DTO): Promise<DTO> {
        const { githubId } = user;
        const result: OkPacketParams = await query(`
            INSERT INTO users
            (github_id)
            VALUES
            (?)
        `, [ githubId ]);

        const newUser: DTO = {
            ...user,
            id: result.insertId
        };

        return newUser;
    }

    async get(githubId: string): Promise<DTO>{
        const user: DTO = (await query(`
            SELECT  id, github_id
            FROM    users
            WHERE   github_id = ?
        `, [ githubId ]))[0]
        return user;
    }

}

const mysql = new MySQL();
export default mysql;