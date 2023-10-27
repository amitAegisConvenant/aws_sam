const AWS = require("aws-sdk")

const USER_TABLE = process.env.USER_TABLE;
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const uuid = require("uuid");


exports.createUser = async (event, context)=>{
    const timeStamp = new Date().getTime();
    const data = JSON.parse(event.body);

    let body;
    let statusCode = 200;

    const headers = {
        "Content-type" : "application/json",
    }

    const params = {
        TableName : USER_TABLE,
        Items:{
            id: uuid.v1(),
            userName: data.username,
            createdAt: timeStamp,
            updatedAt: timeStamp
        }
    }

    if(typeof data !== 'string'){
        console.log("validation failed");
        return;
    }

    try{
        body = await dynamoDB.put((params)).promise();
    }catch(err){
        statusCode = 400;
        body = err.message;
        console.log(err);
    }finally{
        body = JSON.stringify(body);
    }


    return {
        statusCode,
        body,
        headers
    }

}
