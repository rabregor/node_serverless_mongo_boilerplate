const dynamoConfig = {
  region: "us-east-1",
  endpoint: "http://localhost:8000",
  tables: {
    user: "nips_users",
    file: "nips_files",
    organization: "nips_organizations",
    requirement: "nips_requirements",
    folder: "nips_folders",
  },
};

export { dynamoConfig };
