var express = require('express');
var express_graphql = require('express-graphql');
var { buildSchema } = require('graphql');

// Graphql schema
var schema = buildSchema(`
	type Query {
		course(id:Int!): Course
		courses(topic: String): [Course]
	},
	type Mutation {
		updateCourseTopic(id: Int!, topic: String!): Course
	}
	type Course {
		id:Int
		title: String
		author: String
		description: String
		topic: String
		url: String
	}

`);

var coursesData = [
	{
		id:1,
		title: 'The complete node.js Developer course',
		author: 'Andrew mead',
		description: 'Learn Node.js',
		topic: 'Node.js',
		url: 'https://codingthesmartway.com/courses/nodejs/'
	},
	{
		id:2,
		title: 'Node.js express & mongoDb dev to deployment',
		author: 'Brad Traversky',
		description: 'Learn building &deploying real-world node.js',
		topic: 'Node.js',
		url: 'https://codingthesmartway.com/courses/nodejs-express-mongodb/'
	},
	{
		id:3,
		title: 'Javascript: Understanding the weird parts.',
		author: 'Anthony Alicea',
		description: 'An advance javascript course for everyone!',
		topic: 'Javascript',
		url: 'https://codingthesmartway.com/courses/understand-javascript/'
	},
]

var getCourse = function(args) {
	var id = args.id;
	return coursesData.filter(course => {
		return course.id == id;
	})[0];
}

var getCourses = function(args) {
	if(args.topic) {
		var topic = args.topic;
		return coursesData.filter(course => course.topic  === topic);
	} else {
		return coursesData;
	}
}

var updateCourseTopic = function({id, topic}) {
	coursesData.map(course => {
		if(course.id === id){
			course.topic = topic;
			return course;
		}
	});
	return coursesData.filter(course => course.id === id)[0];
}

var root = {
	course: getCourse,
	courses: getCourses,
	updateCourseTopic: updateCourseTopic
};

//Create an express server and a  Graphql endpoint 
var app = express();
app.use('/graphql', express_graphql({
	schema:schema,
	rootValue: root,
	graphiql: true
}));

app.listen(4000, () => console.log('Express Graphql Server Now Running On localhost:4000/graphql'));