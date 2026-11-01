import { expect, it } from "vitest";
import { KEYS } from "@/lib/report-texts";
const values = [[1,"Воскресенье","Рубин","Золото или медь","1, 10, 19, 28"],[2,"Понедельник","Чистые кристаллы, белый жемчуг","Серебро","2, 11, 20, 29"],[3,"Четверг","Жёлтый топаз","Золото","3, 12, 21, 30"],[4,"Четверг","Агат","Серебро","4, 13, 22, 31"],[5,"Среда","Изумруд","Латунь, серебро","5, 14, 23"],[6,"Пятница","Бриллиант","Серебро","6, 15, 24"],[7,"Пятница","Бирюза","Серебро","7, 16, 25"],[8,"Суббота","Синий сапфир","Серебро","8, 17, 26"],[9,"Вторник","Красный коралл","Золото или медь","9, 18, 27"]] as const;
for (const [n, day, stone, metal, fastingDates] of values) {
  it(`материалы ЧУ ${n}`, () => {
    expect(KEYS[n]).toMatchObject({ day, stone, metal, fastingDay:day, fastingDates });
    expect(KEYS[n]?.strong).toBeTruthy(); expect(KEYS[n]?.weak).toBeTruthy(); expect(KEYS[n]?.color).toBeTruthy();
  });
}