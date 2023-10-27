const AWS = require("aws-sdk");
const USER_TABLE = process.env.USER_TABLE;
const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.listUsers = async (event, context)=>{

    let body;
    let statusCode;

    const headers = {
        "Content-type":"applcation/json",
    };

    const params = {
        TableName : USER_TABLE,
    }

    try{
        body = await dynamoDB.scan(params).primise();
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