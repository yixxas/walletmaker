import * as ethers from 'ethers';
import * as readline from 'readline';
import * as fs from 'fs';
import { stdin as input, stdout as output } from 'process';
let assert = require('assert');


let callback = function(progress: number){
    console.log("Encrypting: " + progress * 100 + "% complete");   
}

let user_input = function(query: string) {
    const rl = readline.createInterface({input, output});
    return new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans);
    }));
}

let create_wallet = async function(){

    let wallet = ethers.Wallet.createRandom();

    let options = {
        "scrypt": {"N": 2**14, "r": 224, "p": 4}
    };

    let file_name: string = await user_input("Enter wallet file name: ") as string;
    let password1: string = await user_input("Enter password: ") as string;
    let password2: string = await user_input("Confirm password: ") as string;

    assert(password1 === password2);

    let encryptPromise = await wallet.encrypt(password1,options,callback);

    fs.writeFile(file_name + ".json", encryptPromise, (error) => {
        if(error){
            return console.log(error);
        }
        console.log("Wallet successfully created!");
    });

}

function main(){
    create_wallet();
}

main();
