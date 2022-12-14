// let obj1 = {
//   a: "obj1",
//   f1: () => {console.log(this.a)},
// };
const parent = {
    mom_name: "Samantha Quinn",
    mother: function () {
      return `${this.mom_name} is my mother.`;
    },
  };
console.log(parent.mother());

function test() {
    console.log(this);
  }
  test();