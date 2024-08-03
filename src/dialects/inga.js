/*eslint no-undef: "off"*/

export default {
	id: "inga",
	name: "Inga Assembly",

	registers: [
		{
			name: "L",
		},
		{
			name: "O",
		},
		{
			name: "V",
		},
		{
			name: "E",
		}
	],

	opcodes: [
		{
			pattern: 'READ',
			instruction: function() {
				reg_A = INPUT.pop();
			},
		},
		{
			pattern: 'WRITE',
			instruction: function() {
				OUTPUT.push(reg_A);
			},
		},
		{
			pattern: 'ADD $0',
			instruction: function(op1) {
				if (op1 === "$A") {
					reg_A += reg_A;
				} else if (op1 === "$B") {
					reg_A += reg_B;
				} else {
					reg_A += op1;
				}
			},
		},
	],
};
