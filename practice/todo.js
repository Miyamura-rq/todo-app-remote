const todos = [
    {
        text: "掃除をする",
        deadline: "2026-10-10",
        done: true
    },
    
    {
        text: "大学に連絡",
        deadline: "2026-10-11",
        done: false
    },

    {
        text: "買い物に行く",
        deadline: "2026-10-12",
        done: false
    }
];

function countRemaining(todos) {
    let a = 0;
    for (const todo of todos) {
        if (!todo.done) {
            a = a + 1;
        }
    }
    return a;
}

console.log(todos.length);
console.log(todos[1].text);

for (const todo of todos) {
    console.log(todo.text);
}

console.log(`残り${countRemaining(todos)}件`)
