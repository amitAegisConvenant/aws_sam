const AWS = require("aws-sdk");

const USER_TABLE = process.env.USER_TABLE;
const END_POINT = process.env.END_POINT;
const REGION_NAME = process.env.REGION_NAME;
const ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;

const dynamoDB = new AWS.DynamoDB.DocumentClient({
    endpoint: 'http://localhost:8000',
});

exports.listUsers = async (event, context) => {
    let body;
    let statusCode;

    console.log("Inside the function");
    console.log("USER_TABLE:", USER_TABLE);
    console.log("REGION_NAME:", REGION_NAME);
    console.log("END_POINT:", END_POINT, ACCESS_KEY_ID, SECRET_ACCESS_KEY);

    const headers = {
        "Content-Type": "application/json",
    };

    const params = {
        TableName: USER_TABLE,
    };

    try {
        const data = await dynamoDB.scan(params).promise();
        console.log("Scan result:", data);
        body = JSON.stringify(data);
        statusCode = 200;
    } catch (err) {
        console.error("Error:", err);
        statusCode = 400;
        body = JSON.stringify({ error: err.message });
    }

    return {
        statusCode,
        body,
        headers
    };
}
