module.exports = {
  port: 3306,
  host: 'picnicdatabase.cverolzjl4v8.ap-northeast-2.rds.amazonaws.com',
  username: 'picnic',
  password: 'picnic1234',
  database: 'picnic',
  logging: false,
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: false,
  type: 'mariadb',
};
