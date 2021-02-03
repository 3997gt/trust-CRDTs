const Automerge = require('automerge')


var state =  Automerge.from({
        text: new Automerge.Text("Text ....."),
});


console.log("init state:", state.text.toString())

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

var new_state;
for (let i = 0; i < edits.length; i++) {
  state = Automerge.change(state, "add chars ops",doc => {
    //if (edits[i].length > 2) 
    doc.text.insertAt(edits[i][0], ...edits[i].slice(2))
  })
}
console.log("malcious user added some data:", state.text.toString())

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

for (let i = 0; i <r_edits.length; i++) {
  state = Automerge.change(state, "reverse ops",doc => {
	doc.text.deleteAt(r_edits[i][0])
  })

}
//Final States
console.log("undoing operations:", state.text.toString())

//Automerge.getHistory(state).map(state => console.log([state.change.ops]))
