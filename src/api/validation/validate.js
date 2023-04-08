const regex = {
  firstName: new RegExp(/^(([A-Za-z]+[\-\']?)*([A-Za-z]+)?\s)+([A-Za-z]+[\-\']?)*([A-Za-z]+)?$/, 'i'),
  lastName: new RegExp(/^(([A-Za-z]+[\-\']?)*([A-Za-z]+)?\s)+([A-Za-z]+[\-\']?)*([A-Za-z]+)?$/, 'i'),
  username: new RegExp(/^[a-zA-Z0-9_]{4,25}$/, 'i'),
  email: new RegExp(/(?:[a-z0-9+!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/, 'i'),
  password: new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})"),
};

function check(property, type, regex) {
  if (!property) return;
  if (typeof property != type) throw new Error(`${property} must be of type ${type}`);
  if (!property.match(regex)) throw new Error(`${property} must match regex: ${regex}`)
}

export const validateUser = {
  update: (body) => {
    const { firstName, lastName, email, password, nationality, gender, birthdate, city, avatar, salt, role } = body;
    check(email, 'string', regex.email)
    return body;
  },
  register: (body) => {
    const { firstName, lastName, email, password } = body;
    check(email, 'string', regex.email);
    return body;
  },
}

