import CommonButton from "@/components/common/CommonButton";
import GlowButton from "@/components/common/GlowButton";
import PageHeader from "@/components/common/PageHeader";
import TopBackground from "@/components/common/TopBackground";
import OptionCard from "@/components/riskProfile/optionCard";
import { useAppTheme } from "@/hooks/use-app-theme";
import { getAnswer, getQuestions } from "@/redux/slice/riskProfileSlice";
import { AppDispatch, RootState } from "@/redux/store";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

const KYCQuizScreen: React.FC = () => {
  const theme = useAppTheme();
  const dispatch = useDispatch<AppDispatch>();
  const [currentSection, setCurrentSection] = useState(0);
  const { questions, questionLoading, answers, answerLoading } = useSelector(
    (state: RootState) => state.riskProfile,
  );
  const [localAnswers, setLocalAnswers] = useState<
    Record<string, Record<string, string>>
  >({});

  useEffect(() => {
    dispatch(getQuestions());
    dispatch(getAnswer());
  }, []);

  useEffect(() => {
    if (answers && Object.keys(answers).length > 0) {
      setLocalAnswers(answers);
    }
  }, [answers]);

  const isLoading = questionLoading || answerLoading;
  const totalSections = questions?.length ?? 0;
  const section = questions?.[currentSection];
  const isFirst = currentSection === 0;
  const isLast = currentSection === totalSections - 1;

  const handleSelect = (
    sectionId: string,
    questionId: string,
    value: string,
  ) => {
    setLocalAnswers((prev) => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        [questionId]: value,
      },
    }));
  };

  const handleNext = () => {
    if (!isLast) {
      setCurrentSection((prev) => prev + 1);
    } else {
      console.log("Quiz Complete:", localAnswers);
    }
  };

  const handleBack = () => {
    if (!isFirst) setCurrentSection((prev) => prev - 1);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="#0d1829" />
        <View style={styles.centeredView}>
          <ActivityIndicator size="large" />
        </View>
      </SafeAreaView>
    );
  }

  if (!section) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="#0d1829" />
        <View style={styles.centeredView}>
          <Text style={{ color: "#fff" }}>No questions available.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle="light-content" backgroundColor="#0d1829" />
      <PageHeader title="Risk Profile" />
      <TopBackground />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.header]}>
          <View
            style={[
              styles.header_content,
              { backgroundColor: theme.cardBg, borderColor: theme.borderColor },
            ]}
          >
            <Text style={[styles.sectionTitle, { color: theme.textColor }]}>
              {section?.title}
            </Text>
            <Text style={[styles.sectionDesc, { color: theme.subText }]}>
              {section?.description}
            </Text>
            {/* <Text style={styles.questionText}>
            Note: All questions are mandatory!
          </Text> */}
            {/* <Text style={styles.sectionMeta}>
              Section {currentSection + 1} of {totalSections}
            </Text> */}
          </View>
        </View>
        {section?.questions?.map((question: any, qIndex: number) => {
          const selectedValue = localAnswers[section?.id]?.[question?.id];
          const useOneColumn = question?.options?.length <= 3;

          return (
            <View key={question?.id} style={styles.questionBlock}>
              <Text style={styles.questionText}>
                {qIndex + 1}. {question?.text}
              </Text>

              <View
                style={[
                  styles.optionsGrid,
                  useOneColumn && styles.optionsGridSingle,
                ]}
              >
                {question?.options?.map((option: any) => (
                  <View
                    key={option?.value}
                    style={
                      useOneColumn
                        ? styles.optionWrapFull
                        : styles.optionWrapHalf
                    }
                  >
                    <OptionCard
                      label={option?.displayValue ?? option?.label}
                      description={option?.description}
                      selected={selectedValue === option?.value}
                      onPress={() =>
                        handleSelect(section?.id, question?.id, option?.value)
                      }
                      disabled={false}
                    />
                  </View>
                ))}
              </View>
            </View>
          );
        })}

        <View style={styles.footer}>
          {!isFirst && (
            <CommonButton
              title="Back"
              handleClick={handleBack}
              buttonWidth={"50%"}
            />
          )}
          {!isLast && (
            <GlowButton
              title={isLast ? "Submit" : "Next"}
              buttonWidth={"50%"}
              handleClick={handleNext}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  centeredView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },

  // Header
  header: {
    marginBottom: 20,
  },
  header_content: {
    borderWidth: 1,
    borderColor: "#FFFFFF1A",
    borderRadius: 15,
    padding: 16,
  },
  sectionMeta: {
    fontSize: 11,
    color: "rgba(255,255,255,0.4)",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    lineHeight: 24,
    marginBottom: 4,
  },
  sectionDesc: {
    fontSize: 12,
    lineHeight: 17,
  },

  // Scroll
  scrollView: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  // Question block
  questionBlock: { marginBottom: 28 },

  questionText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#ffffff",
    lineHeight: 20,
    marginBottom: 12,
  },

  // Options grid
  optionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -4,
  },
  optionsGridSingle: { flexDirection: "column" },
  optionWrapHalf: {
    width: "50%",
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  optionWrapFull: {
    width: "100%",
    marginBottom: 8,
  },

  // Footer
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 20,
    gap: 10,
  },
  btnBack: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.07)",
    borderWidth: 0.5,
    borderColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  btnBackText: {
    fontSize: 15,
    fontWeight: "500",
    color: "rgba(255,255,255,0.6)",
  },
  btnNext: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  btnNextFull: { flex: 1 },
  btnNextText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#ffffff",
  },
});

export default KYCQuizScreen;
