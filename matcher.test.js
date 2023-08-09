describe("matcher 테스트", () => {
  const aUser = {
    id: "1",
    name: "geuni",
  };
  let bUser = aUser;

  test("aUSer = bUser", () => {
    expect(aUser).toEqual(bUser);
  });

  test("change bUser name prop", () => {
    bUser.name = "babo";
    expect(aUser).toEqual(bUser);
  });

  test("change reference aUser and bUser", () => {
    bUser = { ...aUser };
    expect(aUSer).toEqual(bUser);
  });

  test("number 0 is falsy but string 0 is truthy", () => {
    expect(0).toBeFalsy();
    expect("0").toBeTruthy();
  });
});

const drinkAll = (callback, flavour) => {
  if (flavour !== "octopus") {
    callback(flavour);
  }
};

describe("drinkAll", () => {
  test("drinks something lemon-flavoured", () => {
    const drink = jest.fn();
    drinkAll(drink, "lemon");

    expect(drink).toHaveBeenCalled(); // 함수 호출 O
  });

  test("does not drink something octopus-flavoured", () => {
    const drink = jest.fn();
    drinkAll(drink, "octopus");

    expect(drink).not.toHaveBeenCalled(); // 함수 호출 X
  });
});

test("array", () => {
  const colors = ["red", "yellow", "blue"];

  expect(colors).toHaveLength(3);
  expect(colors).toContain("yellow");
  expect(colors).not.toContain("green");
});

describe("getUser", () => {
  const getUser = (id) => {
    if (id < 0) {
      throw new Error("Invalid ID");
    }

    return {
      id,
      email: `user${id}@test.com`,
    };
  };

  test("throw when id is non negative", () => {
    // 예외 발생 여부 테스트 가능.
    // toThrow() 함수는 인자도 받는데, 문자열을 넘기면 예외 메시지를 비교하고, 정규식을 넘기면 정규식 체크를 해준다.
    // expect() 함수에 넘기는 검증 대상을 함수로 한 번 감싸줘야 함.
    // expect 내에서 예외가 발생해야 감지가 되는데 값으로 계산되면서 예외가 그 밖에서 발생할 수 있기에 감싸줘야함.
    expect(() => getUser(-1)).toThrow();
    expect(() => getUser(-1)).toThrow("Invalid ID");
  });
});
