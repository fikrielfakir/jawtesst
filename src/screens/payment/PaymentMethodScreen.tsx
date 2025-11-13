import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { ScreenContainer } from '../../design-system/components';
import { colors } from '../../constants/theme/colors';
import { spacing, typography, borderRadius } from '../../constants/theme/spacing';

const PaymentMethodItem = ({ icon, name, last4, isActive, onToggle }: any) => (
  <View style={styles.paymentItem}>
    <View style={styles.paymentIcon}>
      <Text style={styles.iconText}>{icon}</Text>
    </View>
    <View style={styles.paymentInfo}>
      <Text style={styles.paymentName}>{name} ...{last4}</Text>
    </View>
    <Switch
      value={isActive}
      onValueChange={onToggle}
      trackColor={{ false: colors.border, true: colors.primary }}
      thumbColor={colors.white}
    />
  </View>
);

const AddPaymentOption = ({ icon, name, onPress }: any) => (
  <TouchableOpacity style={styles.addOption} onPress={onPress} activeOpacity={0.7}>
    <View style={styles.paymentIcon}>
      <Text style={styles.iconText}>{icon}</Text>
    </View>
    <Text style={styles.addOptionName}>{name}</Text>
    <Text style={styles.chevron}>›</Text>
  </TouchableOpacity>
);

export const PaymentMethodScreen = () => {
  const [cards, setCards] = useState([
    { id: '1', icon: '💳', name: 'Visa', last4: '4242', isActive: false },
    { id: '2', icon: '💳', name: 'Mastercard', last4: '4242', isActive: true },
    { id: '3', icon: '💳', name: 'American Express', last4: '4242', isActive: false },
  ]);

  const [otherMethods, setOtherMethods] = useState([
    { id: '1', icon: '💰', name: 'PayPal', isActive: false },
    { id: '2', icon: '💰', name: 'Venmo', isActive: false },
    { id: '3', icon: '💰', name: 'Apple Pay', isActive: false },
  ]);

  const toggleCard = (id: string) => {
    setCards(cards.map(card => 
      card.id === id ? { ...card, isActive: !card.isActive } : card
    ));
  };

  const toggleOtherMethod = (id: string) => {
    setOtherMethods(otherMethods.map(method => 
      method.id === id ? { ...method, isActive: !method.isActive } : method
    ));
  };

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.title}>Payment Method</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your payment methods</Text>
        <View style={styles.group}>
          {cards.map(card => (
            <PaymentMethodItem
              key={card.id}
              {...card}
              onToggle={() => toggleCard(card.id)}
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Other payment methods</Text>
        <View style={styles.group}>
          {otherMethods.map(method => (
            <PaymentMethodItem
              key={method.id}
              {...method}
              onToggle={() => toggleOtherMethod(method.id)}
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Add a payment method</Text>
        <View style={styles.group}>
          <AddPaymentOption
            icon="💳"
            name="Credit or debit card"
            onPress={() => {}}
          />
          <AddPaymentOption
            icon="💰"
            name="PayPal"
            onPress={() => {}}
          />
        </View>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingVertical: spacing.l,
    alignItems: 'center',
  },
  title: {
    fontSize: typography.title.size,
    fontWeight: typography.title.weight as any,
    color: colors.text,
  },
  section: {
    marginBottom: spacing.xxl,
  },
  sectionTitle: {
    fontSize: typography.heading.size,
    fontWeight: typography.heading.weight as any,
    color: colors.text,
    marginBottom: spacing.m,
  },
  group: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.medium,
    padding: spacing.xs,
  },
  paymentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.m,
    paddingHorizontal: spacing.s,
  },
  paymentIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.small,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.m,
  },
  iconText: {
    fontSize: 20,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentName: {
    fontSize: typography.body.size,
    color: colors.text,
  },
  addOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.m,
    paddingHorizontal: spacing.s,
  },
  addOptionName: {
    flex: 1,
    fontSize: typography.body.size,
    color: colors.text,
  },
  chevron: {
    fontSize: 20,
    color: colors.textSecondary,
  },
});
