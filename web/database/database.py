import pymysql

class DataBase:
    def __init__(self, host, port, user, password, db):
        self.host, self.port, self.user, self.password, self.db = host, port, user, password, db

    def __open_conn(self):
        return pymysql.connect(
            host = self.host,
            port = self.port,
            user = self.user,
            password = self.password,
            db = self.db
        )
    def select(self, sql, *params):
        with self.__open_conn() as connection:
            with connection.cursor(pymysql.cursors.DictCursor) as cursor:
                cursor.execute(sql, params)
                return cursor.fetchall()
            
    def execute(self, sql, *params):
        with self.__open_conn() as connection:
            with connection.cursor() as cursor:
                cursor.execute(sql, params)
                connection.commit()
    
    def execute_multi(self, *sql_params_pairs):
        with self.__open_conn() as connection:
            with connection.cursor() as cursor:
                for pair in sql_params_pairs:
                    cursor.execute(pair[0], pair[1])
                connection.commit()