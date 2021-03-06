import moment from "moment";

/* Todo item */

const initTodoItemState = {
    tooltipOpen: {}
};

export function todoItem(state = initTodoItemState, action) {
    switch (action.type) {
        case '@TODO_ITEM/TOGGLE_TOOLTIP': {
            return {
                tooltipOpen: {
                    // ...state.tooltipOpen,
                    [action.id]: !(state.tooltipOpen[action.id])
                }
            };
		}
        default:
            return state;
    }
}

/* Todo List */

const initTodoListState = {
    listingTodos: false,
    listingMoreTodos: undefined, // id of todo from which to start
    todos: [],
    hasMore: true,
	unaccomplishedOnly: false,
	creatingTodo: false,
	togglingTodoAccomplish: {},
	deletingTodo: {},
	editingTodo: {}
};
export function todoList(state = initTodoListState, action) {
    switch (action.type) {
        case "@TODO_LIST/START_LIST_TODOS": {
            return {
                ...state,
                listingTodos: true,
                listingMoreTodos: undefined
            };
		}
        case "@TODO_LIST/END_LIST_TODOS": {
            if (!action.todos)
                return {
                    ...state,
                    listingTodos: false
                };
            return {
                ...state,
                listingTodos: false,
                todos: action.todos,
                hasMore: action.todos.length > 0
            };
		}
        case "@TODO_LIST/START_LIST_MORE_TODOS": {
            return {
                ...state,
                listingMoreTodos: action.start
            };
		}
        case "@TODO_LIST/END_LIST_MORE_TODOS": {
            if (!action.todos)
                return state;
            return {
                ...state,
                todos: [...state.todos, ...action.todos],
                hasMore: action.todos.length > 0
            };
		}
		case "@TODO_LIST/TOGGLE_UNACCOMPLISHED_ONLY": {
			return {
				...state,
				unaccomplishedOnly: !state.unaccomplishedOnly
			}
		}
		case '@TODO_LIST/START_CREATE_TODO': {
            return {
                ...state,
                creatingTodo: true
            };
		}
        case '@TODO_LIST/END_CREATE_TODO': {
            if (!action.todo)
                return {
                    ...state,
                    creatingPost: false
                };
            var newTodos = state.todos.slice();
            newTodos.unshift(action.todo);
            return {
                ...state,
                creatingTodo: false,
                todos: newTodos
            };
		}
		case "@TODO_LIST/START_TOGGLE_TODO_ACCOMPLISH": {
			let togglingTodoAccomplish = JSON.parse(JSON.stringify(state.togglingTodoAccomplish));
			togglingTodoAccomplish[action.id] = true;
			return {
				...state,
				togglingTodoAccomplish
			};
		}
		case "@TODO_LIST/END_TOGGLE_TODO_ACCOMPLISH": {
			if (action.id !== undefined) {
				const {id} = action;

				let togglingTodoAccomplish = JSON.parse(JSON.stringify(state.togglingTodoAccomplish));
				togglingTodoAccomplish[id] = false;

				let todos = state.todos.map(t => {
					if (t.id === id) {
						let tmp = JSON.parse(JSON.stringify(t));
						if (tmp.doneTs !== null) tmp.doneTs = null;
						else tmp.doneTs = moment().unix();
						return tmp;
					} else return t;

				});
				return {
					...state,
					togglingTodoAccomplish,
					todos
				};
			} else return state;
		}
		case "@TODO_LIST/START_DELETE_TODO": {
			let deletingTodo = JSON.parse(JSON.stringify(state.deletingTodo));
			deletingTodo[action.id] = true;
			return {
				...state,
				deletingTodo
			};
		}
		case "@TODO_LIST/END_DELETE_TODO": {
			if (action.id !== undefined) {
				const {id} = action;

				let deletingTodo = JSON.parse(JSON.stringify(state.deletingTodo));
				deletingTodo[id] = false;

				let todos = state.todos.filter(t => {
					if (t.id === id) return false;
					else return true;
				});

				return {
					...state,
					deletingTodo,
					todos
				};
			} else return state;
		}
		case "@TODO_LIST/START_EDIT_TODO": {
			const {id} = action;

			let editingTodo = JSON.parse(JSON.stringify(state.editingTodo));
			editingTodo[id] = true;

			return {
				...state,
				editingTodo
			};
		}
		case "@TODO_LIST/END_EDIT_TODO": {
			if (action.todo !== undefined) {
				const {todo} = action;

				let editingTodo = JSON.parse(JSON.stringify(state.editingTodo));
				editingTodo[todo.id] = false;

				let todos = state.todos.map(t => {
					if (t.id === todo.id) {
						return todo;
					} else return t;
				});

				return {
					...state,
					todos,
					editingTodo
				};
			} else return state;
		}
        default:
            return state;
    }
}

/* Todo Form */

const initTodoFormState = {
    titleValue: '',
    titleDanger: false,
	deadline: new Date(0),
	selectingDeadline: false,
	fullDay: false,
	deadlineDanger: false
};

export function todoForm(state = initTodoFormState, action) {
    switch (action.type) {
        case '@TODO_FORM/SET_TITLE_VALUE':
            return {
                ...state,
                titleValue: action.titleValue
            };
        case '@TODO_FORM/SET_TITLE_DANGER':
            return {
                ...state,
                titleDanger: action.titleDanger
            };
		case "@TODO_FORM/SET_DEADLINE_DANGER":
			return {
				...state,
				deadlineDanger: action.deadlineDanger
			};
		case "@TODO_FORM/SET_DEADLINE":
			return {
				...state,
				deadline: action.deadline
			};
		case "@TODO_FORM/SET_FULL_DAY":
			return {
				...state,
				fullDay: action.fullDay
			};
		case "@TODO_FORM/CLEAR_TODO_FORM":
			return initTodoFormState;
		case "@TODO_FORM/SET_DEADLINE_PICKER_VISIBLE":
			return {
				...state,
				selectingDeadline: action.selectingDeadline
			};
        default:
            return state;
    }
}
