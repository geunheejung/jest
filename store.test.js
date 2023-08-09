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

    Object.getOwnPropertyNames(o).forEach((prop) => {
      prop === "constructor" || deepFreeze(o[prop]);
    });
  }

  return o;
};

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
    expect(employee.name).toEqual("babo");
  });

  test("case2: 직속 데이터가 아닐 경우 변경 가능하다. -> 달라야 함.", () => {
    employee.address.city = "jeju";
    expect(employee.address.city).toEqual(employee.address.city);
  });
});
