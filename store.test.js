// describe 는 테스트 그룹을 묶어주는 역할, 그 안의 콜백함수 내에 테스트에 쓰일 mock 변수, 객체들을 선언.
describe("계산 테스트", () => {
  const a = 1,
    b = 2;

  test("a + b는 3이다.", () => {
    // to___ 부분에서 사용되는 함수를 흔히 Test Matcher라고 하는데, 위에서 사용된 toEqual() 함수는 값을 비교 시.
    expect(a + b).toEqual(3); // a + b 의 기대값이 3과 같으면 true
  });
});
// npm test 실행 시 프로젝트 내에 모든 테스트 파일을 찾아서 테스트를 실행함.

const deepFreeze = (o) => {
  if (o === Object(o)) {
    Object.isFrozen(o) || Object.isFrozen(o);

    // 전달된 객체의 모든 속성(심볼을 사용하는 속성을 제외한 열거할 수 없는 속성 포함) 들을 배열로 반환.
    // 배열의 열거할 수 있는 속성들의 순서는 for...in 반복문 또는 Object.keys 처리되는 순서와 일치함.
    Object.getOwnPropertyNames(o).forEach((prop) => {
      // 현재 객체를 열거하면서 생성사를 제외한 프로퍼티들 또한 동일하게 동결함.
      prop === "constructor" || deepFreeze(o[prop]);
    });
  }

  return o;
};

const addCounter = (list, value = 0) => {
  return [...list, value];
};

const removeCounter = (list, removeIndex) => {
  return list.filter((row, index) => index !== removeIndex);
};

const incrementCounter = (list, incrementIndex) => {
  return list.map((row, index) => (index === incrementIndex ? row + 1 : row));
};

const testAddCounter = () => {
  const listBefore = [];
  const listAfter = [0];
  // addCounter는 state를 받고, state에 값이 없을 경우 0을 추가한 뒤 반환한다.

  deepFreeze(listBefore);

  expect(addCounter(listBefore)).toEqual(listAfter);
};

const testRemoveCounter = () => {
  const listBefore = [0, 10, 20];
  const listAfter = [0, 20];
  // removeCounter는 첫 번째 인자로 배열을 받고, 두 번째 인자로 index를 받아 index에 해당하는 요소를 지운다.

  deepFreeze(listBefore);

  expect(removeCounter(listBefore, 1)).toEqual(listAfter);
};

const testIncrementCounter = () => {
  const listBefore = [0, 10, 20];
  const listAfter = [0, 11, 20];
  // incrementCounter는 첫 번째 인자로 배열을 받고, 두 번째 인자에 해당하는 요소에 +1 해준다.

  deepFreeze(listBefore);

  expect(incrementCounter(listBefore, 1)).toEqual(listAfter);
};

testAddCounter();
testRemoveCounter();
testIncrementCounter();

describe("얕은 동결 테스트", () => {
  const employee = {
    name: "geuni",
    address: {
      city: "seoul",
    },
  };

  Object.freeze(employee);

  // case1: 직속 데이터의 경우 변경이 불가능하다. -> 동일해야 함.
  // case2: 직속 데이터가 아닐 경우 변경 가능하다. -> 달라야 함.

  test("case1: 직속 데이터의 경우 변경이 불가능하다.", () => {
    employee.name = "babo";
    expect(employee.name).toEqual("geuni");
  });

  test("case2: 직속 데이터가 아닐 경우 변경 가능하다. -> 달라야 함.", () => {
    employee.address.city = "jeju";
    expect(employee.address.city).toEqual(employee.address.city);
  });
});

const toggleTodo = (todo) => {
  return {
    ...todo,
    completed: !todo.completed,
  };
};

const testToggleTodo = () => {
  const todoBefore = {
    id: 0,
    text: "Learn Redux",
    completed: false,
  };

  const todoAfter = {
    id: 0,
    text: "Learn Redux",
    completed: true,
  };

  deepFreeze(todoBefore);

  test("todo completed", () => {
    expect(toggleTodo(todoBefore)).toEqual(todoAfter);
  });
};

testToggleTodo();

describe("test todo reducer.", () => {
  const todos = (stateBefore, action) => {
    switch (action.type) {
      case "ADD_TODO":
        return [
          ...stateBefore,
          {
            id: action.id,
            text: action.text,
            completed: false,
          },
        ];
      case "TOGGLE_TODO":
        return stateBefore.map((row) => {
          if (row.id === action.id) return { ...row, completed: true };

          return row;
        });
      default:
        return stateBefore;
    }
  };

  const stateBefore = [];

  const action = {
    type: "ADD_TODO",
    id: 0,
    text: "Learn Redux",
  };
  const stateAfter = [
    {
      id: 0,
      text: "Learn Redux",
      completed: false,
    },
  ];

  deepFreeze(stateBefore);
  deepFreeze(action);

  test("add todo", () => {
    expect(todos(stateBefore, action)).toEqual(stateAfter);
  });

  const toggleTodo = (payload) => ({
    type: "TOGGLE_TODO",
    id: payload.id,
  });

  test("toggle todo", () => {
    const stateBefore = [
      {
        id: 0,
        text: "Learn Redux",
        completed: false,
      },
      {
        id: 1,
        text: "Go shopping",
        completed: false,
      },
    ];
    const toggleTodoAction = toggleTodo({ id: 1 });

    const stateAfter = [
      {
        id: 0,
        text: "Learn Redux",
        completed: false,
      },
      {
        id: 1,
        text: "Go shopping",
        completed: true,
      },
    ];

    deepFreeze(stateBefore);
    deepFreeze(toggleTodoAction);

    expect(todos(stateAfter, toggleTodoAction)).toEqual(stateAfter);
  });
});
