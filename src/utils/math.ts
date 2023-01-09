import { Buffer, Tuple } from "./types";

export const inverse_3x3 = (matrix: Tuple<Buffer<3>, 3>) => {
  const determinant =
    matrix[0][0] * (matrix[1][1] * matrix[2][2] - matrix[1][2] * matrix[2][1]) -
    matrix[0][1] * (matrix[1][0] * matrix[2][2] - matrix[1][2] * matrix[2][0]) +
    matrix[0][2] * (matrix[1][0] * matrix[2][1] - matrix[1][1] * matrix[2][0]);

  if (determinant === 0) return null;

  const inverse = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];

  inverse[0][0] =
    (matrix[1][1] * matrix[2][2] - matrix[1][2] * matrix[2][1]) / determinant;
  inverse[0][1] =
    (matrix[0][2] * matrix[2][1] - matrix[0][1] * matrix[2][2]) / determinant;
  inverse[0][2] =
    (matrix[0][1] * matrix[1][2] - matrix[0][2] * matrix[1][1]) / determinant;
  inverse[1][0] =
    (matrix[1][2] * matrix[2][0] - matrix[1][0] * matrix[2][2]) / determinant;
  inverse[1][1] =
    (matrix[0][0] * matrix[2][2] - matrix[0][2] * matrix[2][0]) / determinant;
  inverse[1][2] =
    (matrix[0][2] * matrix[1][0] - matrix[0][0] * matrix[1][2]) / determinant;
  inverse[2][0] =
    (matrix[1][0] * matrix[2][1] - matrix[1][1] * matrix[2][0]) / determinant;
  inverse[2][1] =
    (matrix[0][1] * matrix[2][0] - matrix[0][0] * matrix[2][1]) / determinant;
  inverse[2][2] =
    (matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]) / determinant;

  return inverse;
};
