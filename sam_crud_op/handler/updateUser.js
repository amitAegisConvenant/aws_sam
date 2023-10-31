const AWS = require("aws-sdk")

const USER_TABLE = process.env.USER_TABLE;
const END_POINT = process.env.END_POINT;



const dynamoDB = new AWS.DynamoDB.DocumentClient({
    endpoint: END_POINT,
});

exports.updateUser = async (event, context)=>{
    let body;
    let statusCode;
    let response;


    const data = JSON.parse(event.body);

    // checking for user in db with id

    const params = {
        TableName : USER_TABLE,
        Key:{
            "id":event.pathParameters.id,
        }
    }

    try{
        body = await dynamoDB.get(params).promise();
        statusCode = 200;
    }catch(err){
        statusCode = 400;
        body = err.message;
        console.log(err);
    }finally{
        body = JSON.stringify(body);
    }


    // if body of user object is not preset with given id
    if(body.length < 3){ 
        body = "User not found, please provide valid id!";
        statusCode = 400;
        response = {
            body, 
            statusCode
        }
    }else{

        const headers = {
            "Content-type": "application/json",
        }
    
        console.log("Data : ", data);
    
        if(typeof data.username !== 'string' || typeof data.age !== 'string'){
            console.error("Value is not valid!");
            return;
        }
    
        const updateParams = {
            TableName : USER_TABLE,
            Key : {
                id : event.pathParameters.id,
            },
            ExpressionAttributeNames:{
                "user_name": "username",
                "user_age" : "age",
            },
            ExpressionAttributeValues:{
                ":updatedUsername" : data.username,
                ":updatedAge" : data.age
            },
            UpdateExpression : "SET user_name = :updatedUsername, user_age = :updatedAge",
            ReturnValues: 'ALL_NEW',
        }
    
        try{
            body = await dynamoDB.update(updateParams).promise();
            statusCode = 200;
        }catch(err){
            console.log("Error : ", err.message);
            statusCode = 400;
        }finally{
            body = JSON.stringify(body);
        }

        console.log("Body : ", body);
    
        response = {
            body,
            statusCode,
            headers
        }
    }

    return response;
}