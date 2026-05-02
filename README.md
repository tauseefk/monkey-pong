## MNKY

A tiny teaching experiment in 3d-transformations using matrices. It is heavily inspired by Tsoding's [recent video](https://www.youtube.com/watch?v=qjWkNZ0SXfo).
Linear algebra refreshers can be frontloaded with a lot of theory, I wanted to write this as a way to ease into transformations without getting bogged down by theory.
It's currently a work in progress, A diffuse shading pipeline, and pong paddles are in the works.

---

#### Code Checkpoints

- Part 0 - Drawing a cube
  - [Canvas 2D Rect](https://github.com/tauseefk/mnky/commit/e731f4724ad65514a645c674fff0397aa90f9317)
  - [Drawing a point](https://github.com/tauseefk/mnky/commit/151a99ea850540cd85520efa33000ad8606467f8)
  - [Drawing quads](https://github.com/tauseefk/mnky/commit/3ce6f3e7c1abc5006212ca07a52b4427ba3c2cea)
  - [Perspective correction](https://github.com/tauseefk/mnky/commit/ae96988fad793858de3cfd94771a19f23e53eb58)
  - [Faces and lines](https://github.com/tauseefk/mnky/commit/5b18b113395a799a0b670f87d887c112bdd1eb62)

- Part 2 - Rotating the cube
  - [Animation](https://github.com/tauseefk/mnky/commit/a3a11b91675c329fcb5c52a9ae9e442d478959ec)
  - [Rotation and translation](https://github.com/tauseefk/mnky/commit/ee0fbedafb5f99dbd45bf6d9427db70b477f8c39)

- Part 3 - Enter the Matrix
  - [Rotation matrix](https://github.com/tauseefk/mnky/commit/56e06629906b80af94ace14e68e877c4c6b67ee8)
  - [Matrix multiplication](https://github.com/tauseefk/mnky/commit/69f91c723ec9cb2f1e97126c38e57b72f692ad23)

- Part 4 - Hello GPU
  - [Refactor + WebGPU init](https://github.com/tauseefk/mnky/commit/fc6b94e5b5b8f8868ad014e34a86394d617bacd8)
    - [Overview](https://github.com/tauseefk/mnky/blob/b1eeb62ace42ebdc85b39cb45c118c63a23b9598/src/webGPU/README.md)
    - [canvasWebGPU.ts](https://github.com/tauseefk/mnky/blob/fc6b94e5b5b8f8868ad014e34a86394d617bacd8/src/canvasWebGPU.ts)
    - [canvas2d.ts](https://github.com/tauseefk/mnky/blob/fc6b94e5b5b8f8868ad014e34a86394d617bacd8/src/canvas2d.ts)
    - [Transform state](https://github.com/tauseefk/mnky/blob/fc6b94e5b5b8f8868ad014e34a86394d617bacd8/src/main.ts)
