export interface IDatabaseConfigurationAttributes {
  username?: string;
  password?: string;
  database?: string;
  host?: string;
  port?: number | string;
  dialect?: string;
  urlDatabase?: string;
}

export interface IDatabaseConfiguration {
  development: IDatabaseConfigurationAttributes;
  test: IDatabaseConfigurationAttributes;
  production: IDatabaseConfigurationAttributes;
}
