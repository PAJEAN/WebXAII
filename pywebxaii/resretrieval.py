import numpy as np
from dateutil import parser


def _get_res_entry_from_key(results_d, view_id):
    """
    Returning the results dictionary corresponding to the given view_id. Can be a p-task, a p-questionnaire, etc.
    :param results_d: full results dictionary
    :param view_id: id of the view to extract
    :return:
    """
    for entry in results_d["data"]:
        if "view_id" in entry and entry["view_id"] == view_id:
            return entry
    raise KeyError(view_id)


def _get_protocol_entry_from_key(protocol_d, view_id):
    """
    Returning the entry corresponding to the given view_id in the given protocol dictionary. Can be a p-task, a
    p-questionnaire, etc.
    :param protocol_d: full protocol dictionary
    :param view_id: id of the view to extract
    :return:
    """
    for entry in protocol_d:
        if "view_id" in entry and entry["view_id"] == view_id:
            return entry
    raise KeyError(view_id)


def _time_on_view(view_dict):
    """
    Returns the time on the given view
    :param view_dict:
    :return:
    """
    return view_dict["time_on_page"]


def extract_total_times(results_dict):
    """
    Extract the times from the given results dictionary.
    Returning the time from the beginning to the last interaction, and also the total time recorded on all views. These
    values can be (significantly) different if the user logged out at some point.
    :param results_dict:
    :return: start_to_end_time, time_on_pages
    """

    first_connection_time = parser.parse(results_dict["first_connection"])
    last_modification_time = parser.parse(results_dict["last_modification"])
    start_to_end_time = (last_modification_time - first_connection_time).total_seconds()

    time_on_pages = 0
    for entry in results_dict["data"]:
        time_on_pages += entry["time_on_page"]

    return start_to_end_time, time_on_pages


def extract_p_task_results(results_d, view_id, protocol_d=None):
    """
    Return the results of the given task.
    :param results_d: full results dictionary
    :param view_id: id of the results view to extract
    :param protocol_d: protocol dictionary corresponding to the given result dictionary. If specified, this function
    also returns the text value of the choices made by the user.
    :return: answers_idx_vect, answers_text_vect (None if protocol_d not specified), time_vect, time_exceeded_vect
    """

    # Getting the task results
    view_dict = _get_res_entry_from_key(results_d, view_id)

    # Counting number of questions
    nb_quest = view_dict["nb_instances"]

    answers_idx_vect = np.zeros((nb_quest,), dtype=float)
    answers_text_vect = np.zeros((nb_quest,), dtype="U1000") if protocol_d is not None else None
    time_vect = np.zeros((nb_quest,), dtype=float)
    time_exceeded_vect = np.zeros((nb_quest,), dtype=bool)

    if protocol_d is not None:
        protocol_entry = _get_protocol_entry_from_key(protocol_d, view_id)

    for question_entry in view_dict["instances"]:

        actual_idx = question_entry["order_index"]
        answer_idx = question_entry["answers"][0][0] if question_entry["answers"][0] else None
        # try:
        answers_idx_vect[actual_idx] = answer_idx
        # # Happens if the task was incomplete
        # except IndexError:
        #     continue

        if protocol_d is not None:
            answers_text_vect[actual_idx] = protocol_entry["question"]["answers"][answer_idx] if answer_idx is not None else None

        time_vect[actual_idx] = question_entry["time"]
        time_exceeded_vect[actual_idx] = question_entry["is_time_exceeded"]

    return answers_idx_vect, answers_text_vect, time_vect, time_exceeded_vect, _time_on_view(view_dict)


def extract_p_questionnaire_results(results_d, view_id, protocol_d=None):
    """
    Return the results of the given questionnaire.
    :param results_d: full results dictionary
    :param view_id: id of the results view to extract
    :param protocol_d: protocol dictionary corresponding to the given result dictionary. If specified, this function
    also returns the text value of the choices made by the user.
    :return: answer_raw, answers_values (interpretable values, when available), time_vect,
    """

    # Getting the task results
    view_dict = _get_res_entry_from_key(results_d, view_id)

    # Counting number of questions
    nb_quest = len(view_dict["answers"])

    answers_raw = np.zeros((nb_quest,), dtype=object)
    answers_values = np.full((nb_quest,), None)

    if protocol_d is not None:
        protocol_entry = _get_protocol_entry_from_key(protocol_d, view_id)

    for quest_idx in range(nb_quest):
        answer_raw = view_dict["answers"][quest_idx][0] if view_dict["answers"][quest_idx] else None
        answers_raw[quest_idx] = answer_raw
        if answer_raw is not None:

            # If the answer is a string, trying to convert it to a float, or keeping it as it if impossible
            if type(answer_raw) is str:
                try:
                    answers_values[quest_idx] = float(answer_raw)
                except ValueError:
                    answers_values[quest_idx] = answer_raw

            # If the answer is an integer, it is considered as an index. So reaching the corresponding text value if
            # protocol_d is specified.
            elif type(answer_raw) is int:
                if protocol_d is not None:
                    answers_values[quest_idx] = protocol_entry["questions"][quest_idx]["answers"][answer_raw]

    return answers_raw, answers_values, _time_on_view(view_dict)
