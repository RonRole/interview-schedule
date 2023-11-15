from itertools import groupby
from operator import itemgetter

class InterviewTypeFunctions:
    def __init__(self, db):
        self.__db = db

    def list_interview_types(self):
        return self.__db.select('SELECT id, name FROM InterviewTypes')
    

class InterviewStyleFunctions:
    def __init__(self, db):
        self.__db = db

    def list_interview_styles(self):
        return self.__db.select('SELECT id, name FROM InterviewStyles')

class InterviewPlanFunctions:
    def __init__(self, db):
        self.__db = db
    
    def list_interview_plans(self):
        records = self.__db.select('''
            SELECT
                p.id,
                p.start_at,
                p.company_name,
                p.place,
                s.name AS style,
                t.name AS type
            FROM
                InterviewPlans p
            INNER JOIN
                InterviewStyles s
            ON
                p.style_id = s.id
            INNER JOIN
                InterviewPlansAndTypes pt
            ON
                p.id = pt.plan_id
            INNER JOIN
                InterviewTypes t
            ON
                pt.type_id = t.id
            ORDER BY
                p.start_at DESC,
                p.id,
                p.place,
                s.id,
                t.id
        ''')
        return [
            {
                "id": id,
                "start_at" : start_at,
                "company_name" : company_name,
                "place": place,
                "style" : style,
                "types" : [v_item["type"] for v_item in v],
            } for (id, start_at, company_name, place, style), v in groupby(records, key=itemgetter("id","start_at","company_name","place","style"))
        ]
    
    def create_interview_plan(self, start_at, company_name, style_id, place, type_ids):
        self.__db.execute_multi(
            (
                'INSERT INTO InterviewPlans (start_at, company_name, style_id, place) VALUES (%s, %s, %s, %s)',
                [start_at, company_name, style_id, place],
            ),
            *[('INSERT INTO InterviewPlansAndTypes (plan_id, type_id) SELECT LAST_INSERT_ID(), %s', s) for s in type_ids]
        )

    def delete_interview_plan(self, plan_id):
        self.__db.execute('DELETE FROM InterviewPlans WHERE id = %s', plan_id)