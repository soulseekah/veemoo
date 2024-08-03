import { useState, useRef, useEffect } from 'react';
import IngaDialect from './dialects/inga';

import './App.css';

const DIALECTS = [
	IngaDialect,
];

function DialectSelect(props) {

	const dialects = props.availableDialects.map((dialect) => {
		const selected = dialect.id === props.currentDialect;
		return <option key={dialect.id} value={dialect.id}>{dialect.name}</option>;
	});

	return <select
			value={props.currentDialect.id}
			onChange={(e) => props.setCurrentDialect(DIALECTS.find(d => d.id === e.target.value) ?? props.currentDialect)}
		>{dialects}</select>;
}

function Settings(props) {
	return <div className='settings'>
			<div className='dialect_select'>
				<label>Dialect</label>
				<DialectSelect {...props} />
			</div>
		</div>;
}

function Registers(props) {
	const registers = props.currentDialect.registers.map((r) => {
		return <div className='register' key={r.name}>
			<div className='register_name'>{r.name}</div>
			<div className='register_value'>{r.value ?? 0}</div>
		</div>;
	});

	return <div className='registers'>
			{registers}
		</div>;
}

function EditorLine(props) {
	const [line, setLine] = useState(props.line);
	const [cursorPosition, setCursorPosition] = useState(line.length); // @todo(major): wonky
	const inputRef = useRef(null);

	useEffect(() => {
		inputRef.current.setSelectionRange(cursorPosition, cursorPosition);
	}, [line]);

	const handleTyping = (e) => {
		props.setProgram((program) => {
			program[props.currentLine] = e.target.value.toUpperCase();
			return program;
		})
		setLine(e.target.value.toUpperCase());
		setCursorPosition(e.target.selectionEnd);
	};

	return <div className={"editor_line" + (props.isCurrent ? " highlit" : "")}>
			<div className='editor_line_number'>{props.number}</div>
			<input
				className='editor_line_content'
				onInput={handleTyping}
				value={line}
				autoFocus={props.isCurrent}
				onFocus={props.onFocus}
				ref={inputRef}
			/>
		</div>;
}

function Editor(props) {
	const [currentLine, setCurrentLine] = useState(0);
	const [program, setProgram] = useState(props.program);
	const editorRef = useRef(null);

	const lines = program.map((line, index) => {
		return <EditorLine
				key={line + ':' + index}
				isCurrent={currentLine === index}
				currentLine={currentLine}
				number={index}
				line={line}
				setProgram={setProgram}
				onFocus={(e) => setCurrentLine(index)}
			/>
	});

	const handleKeyUp = function(e) {
		if (e.key === 'ArrowUp') {
			if (currentLine > 0) {
				setCurrentLine(currentLine - 1);
				editorRef.current.children[currentLine - 1].querySelector('input').focus();
			}
		}

		if (e.key === 'ArrowDown') {
			if (currentLine < (program.length - 1)) {
				setCurrentLine(currentLine + 1);
				editorRef.current.children[currentLine + 1].querySelector('input').focus();
			}
		}

		if (e.key === 'Enter') {
			let updatedProgram;
			if (currentLine === program.length) {
				updatedProgram = program;
				updatedProgram.push('');
			} else {
				updatedProgram = [
					...program.slice(0, currentLine + 1),
					'',
					...program.slice(currentLine + 1),
				];
			}

			setProgram(updatedProgram);
			props.setProgram(updatedProgram);

			setCurrentLine(currentLine + 1);
		}

		if (e.key === 'Backspace') {
			if (currentLine > 0 && program[currentLine].trim() === "") {
				console.log('delete');
				const updatedProgram = [
					...program.slice(0, currentLine),
					...program.slice(currentLine + 1),
				];

				setProgram(updatedProgram);
				props.setProgram(updatedProgram);

				setCurrentLine(currentLine - 1);
				editorRef.current.children[currentLine - 1].querySelector('input').focus();
			}
		}
	};

	return <div onKeyUp={handleKeyUp} className='editor' ref={editorRef}>
			{lines}
		</div>;
}

function App() {
	const [currentDialect, setCurrentDialect] = useState(DIALECTS[0]);
	const [registers, setRegisters] = useState({});
	const [program, setProgram] = useState(['']);

	return [
		<Settings
			key='settings'
			availableDialects={DIALECTS}
			currentDialect={currentDialect}
			setCurrentDialect={setCurrentDialect}
		/>,
		<Registers
			key='registers'
			currentDialect={currentDialect}
		/>,
		<Editor
			key='editor'
			currentDialect={currentDialect}
			program={program}
			setProgram={setProgram}
		/>
	];
}

export default App;
