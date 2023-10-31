const AWS = require("aws-sdk")

const USER_TABLE = process.env.USER_TABLE;
const END_POINT = process.env.END_POINT;



const dynamoDB = new AWS.DynamoDB.DocumentClient({
    endpoint: END_POINT,
});

exports.updateUser = async (event, context)=>{
    let body;
    let statusCode;

    const data = JSON.parse(event.body);

    const headers = {
        "Content-type": "application/json",
    }

    console.log("Data : ", data);

    if(typeof data.username !== 'string' || typeof data.age !== 'string'){
        console.error("Value is not valid!");
        return;
    }

    const params = {
        TableName : USER_TABLE,
        Key : {
            id : event.pathParameters.id,
        },
        ExpressionAttributeNames:{
            "#username": "username",
            "#age" : "age",
        },
        ExpressionAttributeValues:{
            ":updatedUsername" : data.username,
            ":updatedAge" : data.age
        },
        UpdateExpression : "SET #username = :updatedUsername, #age = :updatedAge",
        ReturnValues: 'ALL_NEW',
    }

    try{
        body = await dynamoDB.update(params).promise();
        statusCode = 200;
    }catch(err){
        console.log("Error : ", err.message);
        statusCode = 400;
    }

    return {
        body, 
        statusCode,
        headers
    }
}