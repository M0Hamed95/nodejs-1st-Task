const yargs = require('yargs')
const fs = require('fs')


function readStudents() {
    try {
        const student = JSON.parse(fs.readFileSync('students.json'))
        return student
    } catch (error) {
        return []
    }
}

function writeStudents(allStudents) {
    fs.writeFile("students.json", JSON.stringify(allStudents), function(err) {
        if (err) throw err;
        console.log('complete');
    });
}


function addStudent(student) {

    const allStudents = readStudents()


    let alreadyExist = false;

    allStudents.forEach((storedStudent) => {
        if (student.id === storedStudent.id) {
            console.log('student already exist');
            alreadyExist = true
            return
        }
    })

    if (!alreadyExist) {
        student.total = student.grades[0] + student.grades[1] + student.grades[2]
        allStudents.push(student)
        writeStudents(allStudents)
    }

}

function getSingleStudent(id) {
    const allStudents = readStudents()
    return allStudents.filter((s) => s.id === id)
}

function deleteStudent(id) {
    const allStudents = readStudents()
    const filteredStudent = allStudents.filter(student => student.id !== id)
    writeStudents(filteredStudent)
}


// add student
yargs.command({
    command: 'add',
    describe: 'Add student',
    builder: {
        id: {
            describe: 'Student id (number)',
            demandOption: true,
            type: 'number'
        },
        name: {
            describe: 'Student name (string)',
            demandOption: true,
            type: 'string'
        },
        grades: {
            describe: 'Student grades (array)',
            demandOption: true,
            type: 'array'
        }
    },
    handler: (argv) => {
        const student = { id: argv.id, name: argv.name, grades: JSON.parse(argv.grades) }
        addStudent(student)
    }
})

// delete (using id)
yargs.command({
    command: 'delete',
    describe: 'Delete note',
    builder: {
        id: {
            describe: 'This is title description in delete command',
            demandOption: true,
            type: 'number'
        }
    },
    handler: (argv) => {
        deleteStudent(argv.id)
    }
})

// get student by id
yargs.command({
    command: 'read',
    describe: 'get a single student by id',
    handler: (argv) => {
        console.log(getSingleStudent(argv.id))
    }
})

// list all students
yargs.command({
    command: 'listAll',
    describe: 'List all students',
    handler: (argv) => {
        console.log(readStudents())

    }
})


yargs.parse()