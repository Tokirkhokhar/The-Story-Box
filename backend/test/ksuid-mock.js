class ULID {
  next() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 10);
  }
}

module.exports = {
  ULID,
};
