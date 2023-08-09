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
  // 동일한 상수를 갖는 것 외에는 switch 논리에서 중복은 없다.
  // todo reducer는 개별 할 일에 대한 변견 사항을 처리하고
  // todos reducer는 배열의 변경 사항을 처리한다.
  // switch 문을 제외하고는 이들 사이에 공유되는 코드는 없다.
  // 로직이 더 복잡해지면(처리하는 작업이 더 많아지면) todo reducer는 커지지만 todos reducder는 거의 동일하게 유지된다.
  // 이것이 분리하는 이유이다. -> 배열의 대해 요소를 추가,삭제,변경에 대해서는 비슷하니.
  // 분리하지 않으면 개별 todo를 변경하는 작업을 더 추가 하려면 인덱스에서 할 일을 변경하는 코드를 복사 후 붙여넣어야 하는데,
  // 이는 중복이 된다. ->
  const todo = (state, action) => {
    switch (action.type) {
      case "ADD_TODO":
        return {
          id: action.id,
          text: action.text,
          completed: false,
        };
      case "TOGGLE_TODO":
        if (state.id !== action.id) return state;

        console.log("state -->", state);
        return {
          ...state,
          completed: !state.completed,
        };
      default:
        return state;
    }
  };

  // 개별 할 일에 대해서 따로 reducer로 분리하지 않고 함수로 분리할 수 있다.
  // ex) addTodo(state, action) 등.
  /*
  여기에는 엄격한 규칙은 없다. 합리적이라면 무엇이든 해도 된다.
  하지만 스위치 문이 중복이라는것은 잘못됐다.
  대규모 앱에서는 모든 Reducer 안에 Switch 있고, 그 중 일부는 동일한 작업을 처리할 것이다.
  이는 정상적인 현상이며, 추상화할 필요가 없다.
  위 처럼 함수로 분리할 경우 시각적 복제(스위치 문)를 논리적 복제(배열의 단일 항목을 업데이트하는 코드) 와 교환하는 것이다.
  
  */

  const todos = (state = [], action) => {
    switch (action.type) {
      case "ADD_TODO":
        return [
          ...state,
          todo(undefined, action), // addTodo여서 그런가 보통은 기존의 state를 토대로 무언가를 처리하는데, 단일한 아이템에서 add의 경우 생성만 해주면 되니깐?
          // {
          //   id: action.id,
          //   text: action.text,
          //   completed: false,
          // },
        ];
      case "TOGGLE_TODO":
        return state.map((row) => todo(row, action)); // 개별 아이템에 대한 처리를 옮김.
      // return stateBefore.map((row) => {
      //   if (row.id === action.id) return { ...row, completed: true };

      //   return row;
      // });
      default:
        return state;
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

    expect(todos(stateBefore, toggleTodoAction)).toEqual(stateAfter);
  });
});
