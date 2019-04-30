from flask import Flask
from schema import Query
from flask_graphql import GraphQLView
from graphene import Schema
import os


view_func = GraphQLView.as_view(
    'graphql', schema=Schema(query=Query), graphiql=True)


app = Flask(__name__)
app.add_url_rule('/graphql', view_func=view_func)
app.debug = True


@app.route('/')
def index():
    return '<h1> Hi, Go to http://127.0.0.1:5000/graphql to type queries</h1>'


if __name__ == '__main__':
    app.run()
