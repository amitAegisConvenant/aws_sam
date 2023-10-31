const AWS = require("aws-sdk")

const USER_TABLE = process.env.USER_TABLE;
const END_POINT = process.env.END_POINT;

const dynamoDB = new AWS.DynamoDB.DocumentClient({
    endpoint: END_POINT,
});

exports.deleteUser = async (event, context) =>{
    let statusCode;
    let body;
    let response;

    const params = {
        TableName : USER_TABLE,
        Key:{
            id:event.pathParameters.id,
        }
    }

    // checking for user is in db or not with given id
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
        body = "User Not Found, Please provide a valid ID!";
        statusCode = 400;
        response = {
            body, 
            statusCode
        }
    }else{
        try{
            await dynamoDB.delete(params).promise();
            body = `User deleted with ID : ${event.pathParameters.id}`;
            statusCode = 200;
        }catch(err){
            console.log("Error :", err.message);
            statusCode = 400;
            body = 'User Not Found, Please provide a valid ID!';
        }finally{
            body = JSON.stringify(body);
        }
    
        response = {
            body,
            statusCode
        };
    }

    return response;
}