const AWS = require("aws-sdk")

const USER_TABLE = process.env.USER_TABLE;
const END_POINT = process.env.END_POINT;

const dynamoDB = new AWS.DynamoDB.DocumentClient({
    endpoint: END_POINT,
});


const uuid = require("uuid");

exports.handler = async (event, context) =>{
    let body;
    let statusCode = 200;
    let response;
    const data = JSON.parse(event.body);
    const headers = {
        "Content-Type": "application/json",
    };

    try{
        switch(event.httpMethod){
            case "POST":
                if(event.requestContext.path === '/user'){
                    const params = {
                        TableName : USER_TABLE,
                        Item:{
                            id: uuid.v1(),
                            username: data.username,
                            age:data.age,
                        }
                    }
                    body = await dynamoDB.put(params).promise();
                    body = "User Created Successfully!"
                }else{
                    console.error("Please check the end point and HTTP Method!");
                }
                break;
            case "GET":
                if(event.requestContext.path === "/users"){
                    const params = {
                        TableName: USER_TABLE,
                    };

                    body = await dynamoDB.scan(params).promise();
                    // console.log("Scan result:", body);
                    
                }else if(event.requestContext.path === "/user/{id}"){
                    const params = {
                        TableName : USER_TABLE,
                        Key:{
                            "id":event.pathParameters.id,
                        }
                    };

                    body = await dynamoDB.get(params).promise();
                    let checkBody = JSON.stringify(body);

                    if(!checkBody.length < 3){
                        body = "User not found, please provide valid ID!"
                        statusCode = 400;
                    }
                }else{
                    console.error("Please check the end point and HTTP Method!");
                    return;
                }
                break;
            case "PUT":
                // console.log("Event :", event);
                if(event.requestContext.path === "/user/{id}"){
                    const params = {
                        TableName : USER_TABLE,
                        Key:{
                            "id":event.pathParameters.id,
                        }
                    };

                    body = await dynamoDB.get(params).promise();
                    let checkBody = JSON.stringify(body);

                    if(checkBody.length < 3){
                        body = "User not found, please provide valid ID!"
                        statusCode = 400;
                    }else{
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
                                "#userName": "username",
                                "#userAge" : "age",
                            },
                            ExpressionAttributeValues:{
                                ":updatedUsername" : data.username,
                                ":updatedAge" : data.age
                            },
                            UpdateExpression : "SET #userName = :updatedUsername, #userAge = :updatedAge",
                            ReturnValues: 'ALL_NEW',
                        }

                        body = await dynamoDB.update(updateParams).promise();
                        statusCode = 200;
                    } 

                }else{
                    console.error("Please check the end point and HTTP Method!");
                    return;
                }
                break;
            case "DELETE":
                if(event.requestContext.path === "/user/{id}"){
                    const params = {
                        TableName : USER_TABLE,
                        Key:{
                            "id":event.pathParameters.id,
                        }
                    };

                    body = await dynamoDB.get(params).promise();
                    let checkBody = JSON.stringify(body);

                    if(checkBody.length < 3){
                        body = "User not found, please provide valid ID!"
                        statusCode = 400;
                    }else{
                        await dynamoDB.delete(params).promise();
                        body = `User deleted with ID : ${event.pathParameters.id}`;
                        statusCode = 200;
                    }
                }else{
                    console.error("Please check the end point and HTTP Method!");
                    return;
                }
                break;
            default:
                throw new Error("Check your HTTP method and try again!")
        }
    }catch (err) {
        statusCode = 400;
        body = err.message;
        console.log(err);
      } finally {
        body = JSON.stringify(body);
      }

      response = {
        body,
        statusCode,
        headers
      }

      return response;
}