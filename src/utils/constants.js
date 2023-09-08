const dynamoConfig = {
    region: 'us-east-1',
    endpoint: 'http://localhost:8000',
    tables: {
        users: 'nips_users',
        files: 'files',
    }
}

export { dynamoConfig}