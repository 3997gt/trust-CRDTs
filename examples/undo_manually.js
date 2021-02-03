const Automerge = require('automerge')

const actorId_main = '1234-abcd-main'
const actorId_edge = '1234-abcd-bad-edge'
const actorId_edge_normal = '1234-abcd-bad-normal'

var main_state =  Automerge.from({
        text: new Automerge.Text("Text ....."),
	actorId_main
});

var init_state_str = Automerge.save(main_state);
var state_edge = Automerge.load(init_state_str, actorId_edge)
var state_edge_normal = Automerge.load(init_state_str, actorId_edge_normal)

console.log("init state of main:", main_state.text.toString())
console.log("init state of bad edge:", state_edge.text.toString())

const edits = [
  [0, 0, "nnnnn"],//insertAt [position, id, added_text]
  [1, 0, "e"],
  [2, 0, "w"],
  [3, 0, "d"],
  [4, 0, "o"],
  [5, 0, "c"],
  [6, 0, "u"],
  [7, 0, "m"],
  [8, 0, "e"],
  [9, 0, "n"],
  [10, 0, "t"],
];

var new_state=state_edge;
for (let i = 0; i < edits.length; i++) {
  new_state = Automerge.change(new_state, "add chars ops",doc => {
    //if (edits[i].length > 2) 
    doc.text.insertAt(edits[i][0], ...edits[i].slice(2))
  })
}

console.log("new_state of bad edge:", new_state.text.toString())

//Updating changes to Main
let changes_edge = Automerge.getChanges(state_edge, new_state)

//skipped remote executions
//network.broadcast(JSON.stringify(changes_edge))
//let changes_edge = JSON.parse(network.receive())
main_state = Automerge.applyChanges(main_state, changes_edge)
console.log("new_state of main after malicious updates:", main_state.text.toString())

//Updating normal edge
state_edge_normal = Automerge.applyChanges(state_edge_normal, changes_edge)
console.log("new_state of state_edge_normal:", state_edge_normal.text.toString())


//TODO: How to automate this from history and actorId_edge
//Automerge.getHistory(new_state_main).map(state => console.log([state.change.ops]))
const r_edits = [
  [ 10, 0 ], //DeleteAt [position, id]
  [ 9, 0 ],
  [ 8, 0 ],  
  [ 7, 0 ],
  [ 6, 0 ],  
  [ 5, 0 ],
  [ 4, 0 ],  
  [ 3, 0 ],
  [ 2, 0 ],
  [ 1, 0 ],
  [ 0, 0 ]
];

var new_state_main=main_state; 
for (let i = 0; i <r_edits.length; i++) {
  new_state_main = Automerge.change(new_state_main, "reverse ops",doc => {
	doc.text.deleteAt(r_edits[i][0])
  })

}

//Final State of Main
console.log("Undoing operations into main:", new_state_main.text.toString())
//Manually Generated Undoing operations
let undo_ops = Automerge.getChanges(main_state, new_state_main)
//Final State of Normal Edge
state_edge_normal = Automerge.applyChanges(state_edge_normal, undo_ops)
console.log("Undoing operations into normal edge:", state_edge_normal.text.toString()); //Text .....

