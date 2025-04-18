from datetime import datetime

from airflow.decorators import task


@task(task_display_name="Normalize Date")
def normalize_date(
  date: str,
) -> tuple[int, int, int]:
  date_normalized = None

  if not date:
    print("No date provided")
    return None

  try:
    date_normalized = datetime.strptime(date.strip(), "%Y%m%d").date()
    date_normalized = (
      date_normalized.year,
      date_normalized.month,
      date_normalized.day,
    )
  except ValueError:
    print("Date is incorrect format: ", date)
    pass

  return date_normalized
