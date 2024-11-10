export const designationRoles = ["Alum", "Collaborator", "Faculty"];

export const intacYears = [2011, 2012, 2014, 2016, 2017, 2018, 2019, 2022, 2024];

export const schoolColors = (school) => {
  if (school == "OCADU") {
    return "#F7931E";
  }
  if (school == "BTK") {
    return "#0071BC";
  }
  return "#ED1C24";
};

export const truncate = (str, maxLength) => {
  if (str.length > maxLength) {
    return str.slice(0, maxLength) + "...";
  }
  return str;
};
